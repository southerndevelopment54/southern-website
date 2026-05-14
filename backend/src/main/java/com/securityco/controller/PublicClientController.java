package com.securityco.controller;

import com.securityco.dto.ClientResponse;
import com.securityco.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class PublicClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getClients(
            @RequestParam(required = false) Boolean featured) {
        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(clientService.getFeatured());
        }
        return ResponseEntity.ok(clientService.getAll());
    }
}
