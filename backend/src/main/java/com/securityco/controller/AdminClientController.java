package com.securityco.controller;

import com.securityco.dto.ClientRequest;
import com.securityco.dto.ClientResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.ClientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/clients")
@RequiredArgsConstructor
public class AdminClientController {

    private final ClientService clientService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAll() {
        return ResponseEntity.ok(clientService.getAllAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(clientService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ClientResponse> create(
            @Valid @RequestBody ClientRequest request,
            HttpServletRequest httpRequest) {
        ClientResponse response = clientService.create(request);
        auditLogService.log("CREATE", "client", response.getId(),
                Map.of("name", request.getName()), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody ClientRequest request,
            HttpServletRequest httpRequest) {
        ClientResponse response = clientService.update(id, request);
        auditLogService.log("UPDATE", "client", id,
                Map.of("name", request.getName()), getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            HttpServletRequest httpRequest) {
        clientService.delete(id);
        auditLogService.log("DELETE", "client", id, null, getIp(httpRequest));
        return ResponseEntity.ok().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
