package com.securityco.controller;

import com.securityco.dto.VacancyResponse;
import com.securityco.service.VacancyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vacancies")
@RequiredArgsConstructor
public class VacancyController {

    private final VacancyService vacancyService;

    @GetMapping
    public ResponseEntity<Page<VacancyResponse>> listVacancies(
            @RequestParam(required = false) Integer districtId,
            @RequestParam(required = false) Integer guardTypeId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(vacancyService.listActiveVacancies(districtId, guardTypeId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacancyResponse> getVacancy(@PathVariable Integer id) {
        return ResponseEntity.ok(vacancyService.getVacancy(id));
    }
}
