package com.securityco.controller;

import com.securityco.dto.VacancyInquiryResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.VacancyInquiryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/vacancy-inquiries")
@RequiredArgsConstructor
public class AdminVacancyInquiryController {

    private final VacancyInquiryService vacancyInquiryService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<VacancyInquiryResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(vacancyInquiryService.listAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacancyInquiryResponse> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(vacancyInquiryService.getById(id));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<VacancyInquiryResponse> markAsRead(@PathVariable Integer id, HttpServletRequest httpRequest) {
        VacancyInquiryResponse response = vacancyInquiryService.markAsRead(id);
        auditLogService.log("MARK_READ", "vacancy_inquiry", id, null, getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpServletRequest httpRequest) {
        vacancyInquiryService.delete(id);
        auditLogService.log("DELETE", "vacancy_inquiry", id, null, getIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
