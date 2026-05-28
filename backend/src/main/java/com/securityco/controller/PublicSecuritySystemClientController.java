package com.securityco.controller;

import com.securityco.dto.SecuritySystemClientResponse;
import com.securityco.service.SecuritySystemClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/security-system-clients")
@RequiredArgsConstructor
public class PublicSecuritySystemClientController {

    private final SecuritySystemClientService service;

    @GetMapping
    public ResponseEntity<List<SecuritySystemClientResponse>> getAll() {
        return ResponseEntity.ok(service.getAllActive());
    }
}
