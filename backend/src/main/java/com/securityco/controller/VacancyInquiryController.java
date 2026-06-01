package com.securityco.controller;

import com.securityco.dto.VacancyInquiryRequest;
import com.securityco.dto.VacancyInquiryResponse;
import com.securityco.service.RateLimitService;
import com.securityco.service.VacancyInquiryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vacancy-inquiries")
@RequiredArgsConstructor
public class VacancyInquiryController {

    private final VacancyInquiryService vacancyInquiryService;
    private final RateLimitService rateLimitService;

    @PostMapping
    public ResponseEntity<?> submit(
            @Valid @RequestBody VacancyInquiryRequest request,
            HttpServletRequest httpRequest
    ) {
        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = httpRequest.getRemoteAddr();
        }
        if (!rateLimitService.isAllowedGlobal(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Please wait before submitting again.");
        }
        String userAgent = httpRequest.getHeader("User-Agent");
        return ResponseEntity.ok(vacancyInquiryService.save(request, ip, userAgent));
    }
}
