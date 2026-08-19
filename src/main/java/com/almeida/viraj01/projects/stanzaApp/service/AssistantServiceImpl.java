package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.dto.AssistantRequestDto;
import com.almeida.viraj01.projects.stanzaApp.dto.AssistantResponseDto;
import com.almeida.viraj01.projects.stanzaApp.dto.ChatSearchFilters;
import com.almeida.viraj01.projects.stanzaApp.dto.HotelPriceResponseDto;
import com.almeida.viraj01.projects.stanzaApp.dto.HotelSearchRequest;
import com.almeida.viraj01.projects.stanzaApp.repository.HotelRepository;
import com.anthropic.client.AnthropicClient;
import com.anthropic.core.JsonSchemaLocalValidation;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.StructuredMessage;
import com.anthropic.models.messages.StructuredMessageCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssistantServiceImpl implements AssistantService {

    private final AnthropicClient anthropicClient;
    private final InventoryService inventoryService;
    private final HotelRepository hotelRepository;

    @Value("${anthropic.api.key:}")
    private String apiKey;

    /** Max hotels to hand back to the chat UI. */
    private static final int MAX_RESULTS = 12;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE;

    private static final String SYSTEM_PROMPT = """
            You are the search assistant for Stanza, a US hotel-booking website.
            Read the user's message and extract their intent and structured filters.
            Do not invent hotels, counts, or availability - a separate system does
            the actual lookups against the database.

            Today's date is %s. Resolve any relative dates (e.g. "this weekend",
            "next Friday", "in 3 days") to absolute ISO dates using today's date.

            Set intent to "COUNT" when the user asks how many / the number of hotels;
            otherwise use "SEARCH". Put every city the user names into "cities". If the
            user gives a check-in date but no check-out date, leave check-out empty.
            Only use amenity values from the allowed list described in the schema,
            mapping natural phrases to them.
            """;

    @Override
    public AssistantResponseDto search(AssistantRequestDto request) {
        String message = request == null ? null : request.getMessage();
        if (message == null || message.isBlank()) {
            return textReply(
                    "Tell me what you're looking for - for example, \"a hotel in Las Vegas with a pool this weekend\".",
                    null, List.of());
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Assistant called but ANTHROPIC_API_KEY is not configured.");
            return textReply(
                    "The AI assistant isn't set up yet. You can still search hotels using the search bar above.",
                    null, List.of());
        }

        ChatSearchFilters filters;
        try {
            filters = extractFilters(message);
        } catch (Exception e) {
            log.error("Failed to extract filters from prompt via Claude", e);
            return textReply("Sorry, I had trouble understanding that. Could you rephrase your request?",
                    null, List.of());
        }

        List<String> cities = cleanList(filters.cities());
        List<String> amenities = filters.amenities() == null ? List.of() : filters.amenities();

        // ---- COUNT intent: answer in words, no hotel cards ----
        if ("COUNT".equalsIgnoreCase(filters.intent())) {
            return handleCount(cities, amenities);
        }

        // ---- SEARCH intent: run the real search and return hotel cards ----
        return handleSearch(filters, cities, amenities);
    }

    // ============================ COUNT ============================

    private AssistantResponseDto handleCount(List<String> cities, List<String> amenities) {
        String amenityText = amenities.isEmpty() ? "" : " with " + String.join(", ", amenities);

        if (cities.isEmpty()) {
            long total = amenities.isEmpty()
                    ? hotelRepository.countByActiveTrue()
                    : hotelRepository.findByActiveTrue().stream()
                    .filter(h -> hasAllAmenities(h.getAmenities(), amenities)).count();
            return textReply("There " + areIs(total) + " " + total + " hotel" + plural(total)
                    + amenityText + " on Stanza.", null, amenities);
        }

        long combined = 0;
        List<String> parts = new ArrayList<>();
        for (String c : cities) {
            long n = countInCity(c, amenities);
            combined += n;
            parts.add(n + " in " + c);
        }

        String reply;
        if (cities.size() == 1) {
            reply = "There " + areIs(combined) + " " + combined + " hotel" + plural(combined)
                    + amenityText + " in " + cities.get(0) + ".";
        } else {
            reply = "There " + areIs(combined) + " " + combined + " hotel" + plural(combined)
                    + amenityText + " combined across " + String.join(" and ", cities)
                    + " (" + String.join(", ", parts) + ").";
        }
        return textReply(reply, String.join(", ", cities), amenities);
    }

    private long countInCity(String city, List<String> amenities) {
        if (amenities.isEmpty()) {
            return hotelRepository.countByActiveTrueAndCityIgnoreCase(city);
        }
        return hotelRepository.findByActiveTrueAndCityIgnoreCase(city).stream()
                .filter(h -> hasAllAmenities(h.getAmenities(), amenities))
                .count();
    }

    // ============================ SEARCH ============================

    private AssistantResponseDto handleSearch(ChatSearchFilters filters, List<String> cities, List<String> amenities) {
        LocalDate checkIn = parseDateOr(filters.checkInDate(), LocalDate.now());
        LocalDate checkOut = parseDateOr(filters.checkOutDate(), checkIn.plusDays(1));
        if (!checkOut.isAfter(checkIn)) {
            checkOut = checkIn.plusDays(1);
        }

        String city = cities.isEmpty() ? null : cities.get(0); // search supports one city at a time
        Integer roomsCount = filters.roomsCount() == null || filters.roomsCount() < 1 ? 1 : filters.roomsCount();

        HotelSearchRequest searchRequest = new HotelSearchRequest();
        searchRequest.setCity(city);
        searchRequest.setName(isBlank(filters.hotelName()) ? null : filters.hotelName().trim());
        searchRequest.setStartDate(checkIn);
        searchRequest.setEndDate(checkOut);
        searchRequest.setRoomsCount(roomsCount);
        searchRequest.setPage(0);
        searchRequest.setSize(50); // pull a wider set, then narrow by amenity in Java

        List<HotelPriceResponseDto> found = new ArrayList<>(
                inventoryService.searchHotels(searchRequest).getContent());

        boolean amenityFallback = false;
        List<HotelPriceResponseDto> matches = found;
        if (!amenities.isEmpty()) {
            List<HotelPriceResponseDto> filtered = found.stream()
                    .filter(h -> hasAllAmenities(h.getAmenities(), amenities))
                    .toList();
            if (filtered.isEmpty()) {
                amenityFallback = true;
            } else {
                matches = filtered;
            }
        }

        if (matches.size() > MAX_RESULTS) {
            matches = matches.subList(0, MAX_RESULTS);
        }

        String reply = buildSearchReply(matches, city, amenities, checkIn, checkOut, amenityFallback);
        return new AssistantResponseDto(reply, matches, city, amenities, checkIn, checkOut);
    }

    // ============================ Claude call ============================

    private ChatSearchFilters extractFilters(String userMessage) {
        String system = SYSTEM_PROMPT.formatted(LocalDate.now().format(ISO));

        StructuredMessageCreateParams<ChatSearchFilters> params = MessageCreateParams.builder()
                .model("claude-opus-4-8")
                .maxTokens(1024L)
                .system(system)
                .addUserMessage(userMessage)
                .outputConfig(ChatSearchFilters.class, JsonSchemaLocalValidation.YES)
                .build();

        StructuredMessage<ChatSearchFilters> response = anthropicClient.messages().create(params);

        return response.content().stream()
                .flatMap(block -> block.text().stream())
                .map(textBlock -> textBlock.text())
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Claude returned no structured output"));
    }

    // ============================ helpers ============================

    private static AssistantResponseDto textReply(String reply, String city, List<String> amenities) {
        return new AssistantResponseDto(reply, List.of(), city, amenities, null, null);
    }

    private static List<String> cleanList(List<String> in) {
        if (in == null) return List.of();
        return in.stream().filter(s -> !isBlank(s)).map(String::trim).toList();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String plural(long n) {
        return n == 1 ? "" : "s";
    }

    private static String areIs(long n) {
        return n == 1 ? "is" : "are";
    }

    private static LocalDate parseDateOr(String iso, LocalDate fallback) {
        if (isBlank(iso)) return fallback;
        try {
            return LocalDate.parse(iso.trim(), ISO);
        } catch (Exception e) {
            return fallback;
        }
    }

    /** True if the hotel offers every requested amenity (case-insensitive, tolerant matching). */
    private static boolean hasAllAmenities(String[] hotelAmenities, List<String> requested) {
        if (hotelAmenities == null || hotelAmenities.length == 0) return false;
        for (String want : requested) {
            if (isBlank(want)) continue;
            String w = want.trim().toLowerCase();
            boolean found = false;
            for (String have : hotelAmenities) {
                if (have == null) continue;
                String h = have.toLowerCase();
                if (h.equals(w) || h.contains(w) || w.contains(h)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }

    private static String buildSearchReply(List<HotelPriceResponseDto> matches, String city, List<String> amenities,
                                           LocalDate checkIn, LocalDate checkOut, boolean amenityFallback) {
        String where = city == null ? "" : " in " + city;
        String amenityText = amenities.isEmpty() ? "" : " with " + String.join(", ", amenities);
        String dates = " for " + checkIn.format(ISO) + " to " + checkOut.format(ISO);

        if (matches.isEmpty()) {
            return "I couldn't find any available hotels" + where + amenityText + dates
                    + ". Try a different city, different dates, or fewer requirements.";
        }

        StringBuilder sb = new StringBuilder();
        if (amenityFallback) {
            sb.append("I couldn't find hotels").append(where).append(amenityText)
                    .append(", but here ").append(matches.size() == 1 ? "is" : "are")
                    .append(" ").append(matches.size()).append(" option")
                    .append(matches.size() == 1 ? "" : "s").append(where).append(dates).append(":");
        } else {
            sb.append("I found ").append(matches.size()).append(" hotel")
                    .append(matches.size() == 1 ? "" : "s").append(where).append(amenityText)
                    .append(dates).append(". Here ").append(matches.size() == 1 ? "it is" : "are the top matches")
                    .append(":");
        }
        return sb.toString();
    }
}