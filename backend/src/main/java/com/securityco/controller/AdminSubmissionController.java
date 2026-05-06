package com.securityco.controller;

import com.securityco.dto.SubmissionResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.SubmissionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/submissions")
@RequiredArgsConstructor
public class AdminSubmissionController {

    private final SubmissionService submissionService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<SubmissionResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(submissionService.listSubmissions(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SubmissionResponse> updateStatus(@PathVariable Integer id, @RequestParam String status, @RequestParam(required = false) String adminNotes, HttpServletRequest httpRequest) {
        SubmissionResponse response = submissionService.updateStatus(id, status, adminNotes);
        auditLogService.log("UPDATE_STATUS", "submission", id, Map.of("status", status), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpServletRequest httpRequest) {
        submissionService.deleteSubmission(id);
        auditLogService.log("DELETE", "submission", id, null, getIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
