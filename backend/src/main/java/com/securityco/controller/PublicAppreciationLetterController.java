package com.securityco.controller;

import com.securityco.dto.AppreciationLetterResponse;
import com.securityco.service.AppreciationLetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/appreciation-letters")
@RequiredArgsConstructor
public class PublicAppreciationLetterController {

    private final AppreciationLetterService service;

    @GetMapping
    public ResponseEntity<List<AppreciationLetterResponse>> getAll() {
        return ResponseEntity.ok(service.getAllActive());
    }
}
