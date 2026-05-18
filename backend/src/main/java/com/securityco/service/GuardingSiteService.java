package com.securityco.service;

import com.securityco.dto.GuardingSiteRequest;
import com.securityco.dto.GuardingSiteResponse;
import com.securityco.model.GuardingSite;
import com.securityco.model.TierLimit;
import com.securityco.repository.GuardingSiteRepository;
import com.securityco.repository.TierLimitRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GuardingSiteService {

    private final GuardingSiteRepository guardingSiteRepository;
    private final TierLimitRepository tierLimitRepository;
    private final MinioService minioService;

    @Transactional(readOnly = true)
    public List<GuardingSiteResponse> getAllActive() {
        return guardingSiteRepository.findAll()
                .stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .sorted((a, b) -> {
                    int o1 = a.getDisplayOrder() != null ? a.getDisplayOrder() : Integer.MAX_VALUE;
                    int o2 = b.getDisplayOrder() != null ? b.getDisplayOrder() : Integer.MAX_VALUE;
                    return Integer.compare(o1, o2);
                })
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GuardingSiteResponse> getAllAdmin() {
        return guardingSiteRepository.findAll()
                .stream()
                .sorted((a, b) -> {
                    int o1 = a.getDisplayOrder() != null ? a.getDisplayOrder() : Integer.MAX_VALUE;
                    int o2 = b.getDisplayOrder() != null ? b.getDisplayOrder() : Integer.MAX_VALUE;
                    return Integer.compare(o1, o2);
                })
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GuardingSiteResponse> getFeatured() {
        return guardingSiteRepository.findActiveFeaturedOrdered()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GuardingSiteResponse> getByCategory(String category) {
        return guardingSiteRepository
                .findActiveByCategoryOrdered(category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public GuardingSiteResponse getById(Integer id) {
        GuardingSite site = guardingSiteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Guarding site not found"));
        return toResponse(site);
    }

    @Transactional
    public GuardingSiteResponse create(GuardingSiteRequest request) {
        if (Boolean.TRUE.equals(request.getIsFeatured())) {
            validateFeaturedLimit(request.getCategory(), null);
        }

        GuardingSite site = new GuardingSite();
        site.setName(request.getName());
        site.setImageKey(request.getImageKey());
        site.setAddress(request.getAddress());
        site.setCategory(request.getCategory());
        site.setIsFeatured(request.getIsFeatured());
        site.setDisplayOrder(request.getDisplayOrder());
        site.setIsActive(request.getIsActive());

        GuardingSite saved = guardingSiteRepository.save(site);
        return toResponse(saved);
    }

    @Transactional
    public GuardingSiteResponse update(Integer id, GuardingSiteRequest request) {
        GuardingSite site = guardingSiteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Guarding site not found"));

        boolean categoryChanged = !site.getCategory().equals(request.getCategory());
        boolean featuredChangedToTrue = Boolean.TRUE.equals(request.getIsFeatured()) && !Boolean.TRUE.equals(site.getIsFeatured());
        boolean activating = Boolean.TRUE.equals(request.getIsActive()) && !Boolean.TRUE.equals(site.getIsActive());
        if (Boolean.TRUE.equals(request.getIsFeatured()) && (categoryChanged || featuredChangedToTrue || activating)) {
            validateFeaturedLimit(request.getCategory(), id);
        }

        site.setName(request.getName());
        site.setImageKey(request.getImageKey());
        site.setAddress(request.getAddress());
        site.setCategory(request.getCategory());
        site.setIsFeatured(request.getIsFeatured());
        site.setDisplayOrder(request.getDisplayOrder());
        site.setIsActive(request.getIsActive());

        GuardingSite saved = guardingSiteRepository.save(site);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Integer id) {
        GuardingSite site = guardingSiteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Guarding site not found"));
        guardingSiteRepository.delete(site);
    }

    private void validateFeaturedLimit(String category, Integer excludeId) {
        int maxCount = tierLimitRepository.findByCategoryAndTier(category, 1)
                .map(TierLimit::getMaxCount)
                .orElse(9);

        long currentCount = guardingSiteRepository.countByCategoryAndIsFeaturedTrueAndIsActiveTrue(category);
        if (excludeId != null) {
            Optional<GuardingSite> excluded = guardingSiteRepository.findById(excludeId);
            if (excluded.isPresent()
                    && excluded.get().getCategory().equals(category)
                    && Boolean.TRUE.equals(excluded.get().getIsFeatured())
                    && Boolean.TRUE.equals(excluded.get().getIsActive())) {
                currentCount--;
            }
        }

        if (currentCount >= maxCount) {
            throw new IllegalArgumentException("Featured limit reached for '" + category
                    + "'. Maximum allowed: " + maxCount);
        }
    }

    private GuardingSiteResponse toResponse(GuardingSite site) {
        GuardingSiteResponse response = new GuardingSiteResponse();
        response.setId(site.getId());
        response.setName(site.getName());
        response.setImageKey(site.getImageKey());
        if (site.getImageKey() != null && !site.getImageKey().isBlank()) {
            response.setImageUrl(minioService.getPublicUrl(site.getImageKey()));
        }
        response.setAddress(site.getAddress());
        response.setCategory(site.getCategory());
        response.setIsFeatured(site.getIsFeatured());
        response.setDisplayOrder(site.getDisplayOrder());
        response.setIsActive(site.getIsActive());
        response.setCreatedAt(site.getCreatedAt());
        response.setUpdatedAt(site.getUpdatedAt());
        return response;
    }
}
