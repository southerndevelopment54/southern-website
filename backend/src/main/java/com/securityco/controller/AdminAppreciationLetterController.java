package com.securityco.controller;

import com.securityco.dto.AppreciationLetterRequest;
import com.securityco.dto.AppreciationLetterResponse;
import com.securityco.service.AppreciationLetterService;
import com.securityco.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/appreciation-letters")
@RequiredArgsConstructor
public class AdminAppreciationLetterController {

    private final AppreciationLetterService service;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AppreciationLetterResponse>> getAll() {
        return ResponseEntity.ok(service.getAllAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppreciationLetterResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<AppreciationLetterResponse> create(
            @Valid @RequestBody AppreciationLetterRequest request,
            HttpServletRequest httpRequest) {
        AppreciationLetterResponse response = service.create(request);
        auditLogService.log("CREATE", "appreciation_letter", response.getId(),
                Map.of("date", request.getDate().toString()), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppreciationLetterResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody AppreciationLetterRequest request,
            HttpServletRequest httpRequest) {
        AppreciationLetterResponse response = service.update(id, request);
        auditLogService.log("UPDATE", "appreciation_letter", id,
                Map.of("date", request.getDate().toString()), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            HttpServletRequest httpRequest) {
        service.delete(id);
        auditLogService.log("DELETE", "appreciation_letter", id, null, getIp(httpRequest));
        return ResponseEntity.ok().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
