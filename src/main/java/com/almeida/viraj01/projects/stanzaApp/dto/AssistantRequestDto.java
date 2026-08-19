package com.almeida.viraj01.projects.stanzaApp.dto;

import lombok.Data;

/**
 * A single message the user typed into the AI assistant chat box.
 */
@Data
public class AssistantRequestDto {
    private String message;
}