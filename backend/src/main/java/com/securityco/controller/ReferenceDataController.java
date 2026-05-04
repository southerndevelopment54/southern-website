package com.securityco.controller;

import com.securityco.model.District;
import com.securityco.model.EducationLevel;
import com.securityco.model.SecurityGuardType;
import com.securityco.repository.DistrictRepository;
import com.securityco.repository.EducationLevelRepository;
import com.securityco.repository.SecurityGuardTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final DistrictRepository districtRepository;
    private final SecurityGuardTypeRepository guardTypeRepository;
    private final EducationLevelRepository educationLevelRepository;

    @GetMapping("/vacancies/districts")
    public ResponseEntity<List<District>> getDistricts() {
        return ResponseEntity.ok(districtRepository.findAll());
    }

    @GetMapping("/vacancies/guard-types")
    public ResponseEntity<List<SecurityGuardType>> getGuardTypes() {
        return ResponseEntity.ok(guardTypeRepository.findAll());
    }

    @GetMapping("/education-levels")
    public ResponseEntity<List<EducationLevel>> getEducationLevels() {
        return ResponseEntity.ok(educationLevelRepository.findAll());
    }
}
