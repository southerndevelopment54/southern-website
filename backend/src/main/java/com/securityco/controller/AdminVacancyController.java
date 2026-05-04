package com.securityco.controller;

import com.securityco.dto.VacancyRequest;
import com.securityco.dto.VacancyResponse;
import com.securityco.service.VacancyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/vacancies")
@RequiredArgsConstructor
public class AdminVacancyController {

    private final VacancyService vacancyService;

    @GetMapping
    public ResponseEntity<Page<VacancyResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(vacancyService.listAllVacancies(pageable));
    }

    @PostMapping
    public ResponseEntity<VacancyResponse> create(@Valid @RequestBody VacancyRequest request) {
        return ResponseEntity.ok(vacancyService.createVacancy(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacancyResponse> update(@PathVariable Integer id, @Valid @RequestBody VacancyRequest request) {
        return ResponseEntity.ok(vacancyService.updateVacancy(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vacancyService.deleteVacancy(id);
        return ResponseEntity.noContent().build();
    }
}
