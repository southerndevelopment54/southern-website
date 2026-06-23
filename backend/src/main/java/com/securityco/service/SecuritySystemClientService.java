package com.securityco.service;

import com.securityco.dto.SecuritySystemClientRequest;
import com.securityco.dto.SecuritySystemClientResponse;
import com.securityco.model.SecuritySystemClient;
import com.securityco.repository.SecuritySystemClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SecuritySystemClientService {

    private final SecuritySystemClientRepository repository;
    private final MinioService minioService;

    @Transactional(readOnly = true)
    public List<SecuritySystemClientResponse> getAllActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SecuritySystemClientResponse> getAllAdmin() {
        return repository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SecuritySystemClientResponse getById(Integer id) {
        SecuritySystemClient entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Security system client not found"));
        return toResponse(entity);
    }

    @Transactional
    public SecuritySystemClientResponse create(SecuritySystemClientRequest request) {
        SecuritySystemClient entity = new SecuritySystemClient();
        entity.setName(request.getName());
        entity.setNameEn(request.getNameEn());
        entity.setNameCn(request.getNameCn());
        entity.setLogoKey(request.getLogoKey());
        entity.setDisplayOrder(request.getDisplayOrder());
        entity.setIsActive(request.getIsActive());

        SecuritySystemClient saved = repository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public SecuritySystemClientResponse update(Integer id, SecuritySystemClientRequest request) {
        SecuritySystemClient entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Security system client not found"));

        entity.setName(request.getName());
        entity.setNameEn(request.getNameEn());
        entity.setNameCn(request.getNameCn());
        entity.setLogoKey(request.getLogoKey());
        entity.setDisplayOrder(request.getDisplayOrder());
        entity.setIsActive(request.getIsActive());

        SecuritySystemClient saved = repository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Integer id) {
        SecuritySystemClient entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Security system client not found"));
        repository.delete(entity);
    }

    private SecuritySystemClientResponse toResponse(SecuritySystemClient entity) {
        SecuritySystemClientResponse response = new SecuritySystemClientResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setNameEn(entity.getNameEn());
        response.setNameCn(entity.getNameCn());
        response.setLogoKey(entity.getLogoKey());
        if (entity.getLogoKey() != null && !entity.getLogoKey().isBlank()) {
            response.setLogoUrl(minioService.getPublicUrl(entity.getLogoKey()));
        }
        response.setDisplayOrder(entity.getDisplayOrder());
        response.setIsActive(entity.getIsActive());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}
