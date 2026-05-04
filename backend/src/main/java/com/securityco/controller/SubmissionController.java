package com.securityco.controller;

import com.securityco.dto.SubmissionRequest;
import com.securityco.dto.SubmissionResponse;
import com.securityco.service.RateLimitService;
import com.securityco.service.SubmissionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final RateLimitService rateLimitService;

    @PostMapping
    public ResponseEntity<?> submit(
            @Valid @RequestBody SubmissionRequest request,
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
        return ResponseEntity.ok(submissionService.createSubmission(request, ip));
    }
}
