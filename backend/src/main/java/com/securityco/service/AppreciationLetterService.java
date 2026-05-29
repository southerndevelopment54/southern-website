package com.securityco.service;

import com.securityco.dto.AppreciationLetterRequest;
import com.securityco.dto.AppreciationLetterResponse;
import com.securityco.model.AppreciationLetter;
import com.securityco.repository.AppreciationLetterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppreciationLetterService {

    private final AppreciationLetterRepository repository;
    private final MinioService minioService;

    @Transactional(readOnly = true)
    public List<AppreciationLetterResponse> getAllActive() {
        return repository.findByIsActiveTrueOrderByDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppreciationLetterResponse> getAllAdmin() {
        return repository.findAllByOrderByDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppreciationLetterResponse getById(Integer id) {
        AppreciationLetter entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appreciation letter not found"));
        return toResponse(entity);
    }

    @Transactional
    public AppreciationLetterResponse create(AppreciationLetterRequest request) {
        AppreciationLetter entity = new AppreciationLetter();
        entity.setDate(request.getDate());
        entity.setImageKey(request.getImageKey());
        entity.setDisplayOrder(request.getDisplayOrder());
        entity.setIsActive(request.getIsActive());

        AppreciationLetter saved = repository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public AppreciationLetterResponse update(Integer id, AppreciationLetterRequest request) {
        AppreciationLetter entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appreciation letter not found"));

        entity.setDate(request.getDate());
        entity.setImageKey(request.getImageKey());
        entity.setDisplayOrder(request.getDisplayOrder());
        entity.setIsActive(request.getIsActive());

        AppreciationLetter saved = repository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Integer id) {
        AppreciationLetter entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appreciation letter not found"));
        repository.delete(entity);
    }

    private AppreciationLetterResponse toResponse(AppreciationLetter entity) {
        AppreciationLetterResponse response = new AppreciationLetterResponse();
        response.setId(entity.getId());
        response.setDate(entity.getDate());
        response.setImageKey(entity.getImageKey());
        if (entity.getImageKey() != null && !entity.getImageKey().isBlank()) {
            response.setImageUrl(minioService.getPublicUrl(entity.getImageKey()));
        }
        response.setDisplayOrder(entity.getDisplayOrder());
        response.setIsActive(entity.getIsActive());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}
