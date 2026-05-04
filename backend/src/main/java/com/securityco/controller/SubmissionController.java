package com.securityco.controller;

import com.securityco.dto.SubmissionRequest;
import com.securityco.dto.SubmissionResponse;
import com.securityco.service.SubmissionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @PostMapping
    public ResponseEntity<SubmissionResponse> submit(
            @Valid @RequestBody SubmissionRequest request,
            HttpServletRequest httpRequest
    ) {
        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = httpRequest.getRemoteAddr();
        }
        return ResponseEntity.ok(submissionService.createSubmission(request, ip));
    }
}
