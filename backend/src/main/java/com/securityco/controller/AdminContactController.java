package com.securityco.controller;

import com.securityco.dto.ContactResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.ContactMessageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactMessageService contactMessageService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<ContactResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(contactMessageService.listAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(contactMessageService.getById(id));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ContactResponse> markAsRead(@PathVariable Integer id, HttpServletRequest httpRequest) {
        ContactResponse response = contactMessageService.markAsRead(id);
        auditLogService.log("MARK_READ", "inquiry", id, null, getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpServletRequest httpRequest) {
        contactMessageService.delete(id);
        auditLogService.log("DELETE", "inquiry", id, null, getIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
