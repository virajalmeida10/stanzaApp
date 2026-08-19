package com.almeida.viraj01.projects.stanzaApp.config;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Builds the Anthropic (Claude) client used by the AI assistant.
 *
 * The key comes from the {@code anthropic.api.key} property, which is wired to the
 * ANTHROPIC_API_KEY environment variable. If it's blank (e.g. local dev without a
 * key) we still create a client so the app boots — the assistant service checks
 * the key and returns a friendly message instead of calling the API.
 */
@Configuration
@Slf4j
public class AnthropicConfig {

    @Bean
    public AnthropicClient anthropicClient(@Value("${anthropic.api.key:}") String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("ANTHROPIC_API_KEY is not set - the AI assistant will be disabled until it is configured.");
            // Placeholder key so the bean exists and the app boots; real calls won't be made.
            return AnthropicOkHttpClient.builder().apiKey("not-configured").build();
        }
        log.info("Anthropic client initialized - AI assistant enabled.");
        return AnthropicOkHttpClient.builder().apiKey(apiKey).build();
    }
}