package com.securityco.controller;

import com.securityco.dto.ContactRequest;
import com.securityco.dto.ContactResponse;
import com.securityco.service.ContactMessageService;
import com.securityco.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService contactMessageService;
    private final RateLimitService rateLimitService;

    @PostMapping
    public ResponseEntity<?> submit(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest
    ) {
        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = httpRequest.getRemoteAddr();
        }
        if (!rateLimitService.isAllowed(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Please wait 1 minute before submitting again.");
        }
        String userAgent = httpRequest.getHeader("User-Agent");
        return ResponseEntity.ok(contactMessageService.save(request, ip, userAgent));
    }
}
