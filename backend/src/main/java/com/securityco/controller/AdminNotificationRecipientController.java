package com.securityco.controller;

import com.securityco.dto.NotificationRecipientRequest;
import com.securityco.dto.NotificationRecipientResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.NotificationRecipientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notification-recipients")
@RequiredArgsConstructor
public class AdminNotificationRecipientController {

    private final NotificationRecipientService service;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<NotificationRecipientResponse>> listAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<NotificationRecipientResponse> create(
            @Valid @RequestBody NotificationRecipientRequest request,
            HttpServletRequest httpRequest) {
        NotificationRecipientResponse response = service.create(request);
        auditLogService.log("CREATE", "notification_recipient", response.getId(), null, getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationRecipientResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody NotificationRecipientRequest request,
            HttpServletRequest httpRequest) {
        NotificationRecipientResponse response = service.update(id, request);
        auditLogService.log("UPDATE", "notification_recipient", id, null, getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpServletRequest httpRequest) {
        service.delete(id);
        auditLogService.log("DELETE", "notification_recipient", id, null, getIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
