package com.securityco.controller;

import com.securityco.dto.SecuritySystemClientRequest;
import com.securityco.dto.SecuritySystemClientResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.SecuritySystemClientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/security-system-clients")
@RequiredArgsConstructor
public class AdminSecuritySystemClientController {

    private final SecuritySystemClientService service;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<SecuritySystemClientResponse>> getAll() {
        return ResponseEntity.ok(service.getAllAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SecuritySystemClientResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<SecuritySystemClientResponse> create(
            @Valid @RequestBody SecuritySystemClientRequest request,
            HttpServletRequest httpRequest) {
        SecuritySystemClientResponse response = service.create(request);
        auditLogService.log("CREATE", "security_system_client", response.getId(),
                Map.of("name", request.getName()), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SecuritySystemClientResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody SecuritySystemClientRequest request,
            HttpServletRequest httpRequest) {
        SecuritySystemClientResponse response = service.update(id, request);
        auditLogService.log("UPDATE", "security_system_client", id,
                Map.of("name", request.getName()), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            HttpServletRequest httpRequest) {
        service.delete(id);
        auditLogService.log("DELETE", "security_system_client", id, null, getIp(httpRequest));
        return ResponseEntity.ok().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
