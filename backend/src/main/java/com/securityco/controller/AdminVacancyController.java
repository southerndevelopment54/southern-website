package com.securityco.controller;

import com.securityco.dto.VacancyRequest;
import com.securityco.dto.VacancyResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.VacancyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/vacancies")
@RequiredArgsConstructor
public class AdminVacancyController {

    private final VacancyService vacancyService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<VacancyResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(vacancyService.listAllVacancies(pageable));
    }

    @PostMapping
    public ResponseEntity<VacancyResponse> create(@Valid @RequestBody VacancyRequest request, HttpServletRequest httpRequest) {
        VacancyResponse response = vacancyService.createVacancy(request);
        auditLogService.log("CREATE", "vacancy", response.getId(), null, getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacancyResponse> update(@PathVariable Integer id, @Valid @RequestBody VacancyRequest request, HttpServletRequest httpRequest) {
        VacancyResponse response = vacancyService.updateVacancy(id, request);
        auditLogService.log("UPDATE", "vacancy", id, null, getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpServletRequest httpRequest) {
        vacancyService.deleteVacancy(id);
        auditLogService.log("DELETE", "vacancy", id, null, getIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
