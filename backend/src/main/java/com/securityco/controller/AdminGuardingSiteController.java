package com.securityco.controller;

import com.securityco.dto.GuardingSiteRequest;
import com.securityco.dto.GuardingSiteResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.GuardingSiteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminGuardingSiteController {

    private final GuardingSiteService guardingSiteService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<GuardingSiteResponse>> getAll() {
        return ResponseEntity.ok(guardingSiteService.getAllAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuardingSiteResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(guardingSiteService.getById(id));
    }

    @PostMapping
    public ResponseEntity<GuardingSiteResponse> create(
            @Valid @RequestBody GuardingSiteRequest request,
            HttpServletRequest httpRequest) {
        GuardingSiteResponse response = guardingSiteService.create(request);
        auditLogService.log("CREATE", "guarding_site", response.getId(),
                Map.of("name", request.getName(), "category", request.getCategory()),
                getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuardingSiteResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody GuardingSiteRequest request,
            HttpServletRequest httpRequest) {
        GuardingSiteResponse response = guardingSiteService.update(id, request);
        auditLogService.log("UPDATE", "guarding_site", id,
                Map.of("name", request.getName(), "category", request.getCategory()),
                getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            HttpServletRequest httpRequest) {
        guardingSiteService.delete(id);
        auditLogService.log("DELETE", "guarding_site", id, null, getIp(httpRequest));
        return ResponseEntity.ok().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
