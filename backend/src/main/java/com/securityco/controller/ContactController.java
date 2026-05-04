package com.securityco.controller;

import com.securityco.dto.ContactRequest;
import com.securityco.model.ContactMessage;
import com.securityco.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ContactMessage> submit(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(contactMessageService.save(request));
    }
}
