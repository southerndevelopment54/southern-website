package com.securityco.controller;

import com.securityco.dto.EnterpriseTypeResponse;
import com.securityco.service.EnterpriseTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-types")
@RequiredArgsConstructor
public class PublicEnterpriseTypeController {

    private final EnterpriseTypeService enterpriseTypeService;

    @GetMapping
    public ResponseEntity<List<EnterpriseTypeResponse>> getAll() {
        return ResponseEntity.ok(enterpriseTypeService.getAll());
    }
}
