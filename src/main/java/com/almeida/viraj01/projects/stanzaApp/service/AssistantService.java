package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.dto.AssistantRequestDto;
import com.almeida.viraj01.projects.stanzaApp.dto.AssistantResponseDto;

public interface AssistantService {

    /**
     * Turn a free-text prompt (e.g. "Find me a room in New York with a pool")
     * into structured filters via Claude, run them through the existing hotel
     * search, and return a chat reply plus the matching hotels.
     */
    AssistantResponseDto search(AssistantRequestDto request);
}