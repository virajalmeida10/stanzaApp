package com.almeida.viraj01.projects.stanzaApp.dto;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

/**
 * The structured intent + filters Claude extracts from a free-text prompt like
 * "Find me a room in New York with a pool" or "how many hotels are in NY and
 * Chicago?". This record IS the JSON schema the Anthropic SDK sends as a
 * structured-output format, so every field must be something the model can
 * always fill (empty string / empty list when the user didn't mention it) —
 * do not make fields nullable.
 */
public record ChatSearchFilters(

        @JsonPropertyDescription("What the user wants. Use \"COUNT\" when they ask HOW MANY / the NUMBER OF / "
                + "to count hotels (e.g. \"how many hotels are in New York?\"). Use \"SEARCH\" when they want to "
                + "find, see, or book hotels. Default to \"SEARCH\" when unsure.")
        String intent,

        @JsonPropertyDescription("The cities involved, e.g. [\"New York\"] or [\"New York\", \"Chicago\"]. "
                + "Include every city the user names. Empty list if the user did not mention any city "
                + "(for SEARCH that means search everywhere; for COUNT that means count across all cities).")
        List<String> cities,

        @JsonPropertyDescription("Amenities the user asked for. Only use values from this exact list: "
                + "[\"Free WiFi\", \"Swimming Pool\", \"Fitness Center\", \"Free Parking\", \"Restaurant\", "
                + "\"Bar\", \"Spa\", \"Pet Friendly\", \"Airport Shuttle\", \"Room Service\", \"Business Center\", "
                + "\"Air Conditioning\", \"Breakfast Included\", \"Beach Access\", \"Family Rooms\"]. "
                + "Map synonyms to these (e.g. \"gym\" -> \"Fitness Center\", \"pool\" -> \"Swimming Pool\", "
                + "\"wifi\"/\"internet\" -> \"Free WiFi\", \"parking\" -> \"Free Parking\", \"breakfast\" -> "
                + "\"Breakfast Included\", \"pets\"/\"dog\" -> \"Pet Friendly\"). Empty list if none were requested.")
        List<String> amenities,

        @JsonPropertyDescription("Desired check-in date as an absolute ISO date (yyyy-MM-dd). "
                + "Resolve relative phrases like \"this weekend\" or \"next Friday\" using today's date given in the "
                + "system prompt. Empty string if the user did not mention dates.")
        String checkInDate,

        @JsonPropertyDescription("Desired check-out date as an absolute ISO date (yyyy-MM-dd). "
                + "Empty string if the user did not mention it.")
        String checkOutDate,

        @JsonPropertyDescription("Number of rooms the user wants. Use 1 if not specified.")
        Integer roomsCount,

        @JsonPropertyDescription("A specific hotel name the user is looking for, if any. Empty string otherwise.")
        String hotelName
) {
}