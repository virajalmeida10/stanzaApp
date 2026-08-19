package com.almeida.viraj01.projects.stanzaApp.controller;

import com.almeida.viraj01.projects.stanzaApp.dto.AssistantRequestDto;
import com.almeida.viraj01.projects.stanzaApp.dto.AssistantResponseDto;
import com.almeida.viraj01.projects.stanzaApp.service.AssistantService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final AssistantService assistantService;

    @PostMapping("/search")
    @Operation(summary = "AI hotel search assistant", tags = {"AI Assistant"})
    public ResponseEntity<AssistantResponseDto> search(@RequestBody AssistantRequestDto request) {
        return ResponseEntity.ok(assistantService.search(request));
    }
}