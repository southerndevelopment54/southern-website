package com.securityco.service;

import com.securityco.dto.GuardingSiteRequest;
import com.securityco.dto.GuardingSiteResponse;
import com.securityco.model.GuardingSite;
import com.securityco.model.TierLimit;
import com.securityco.repository.GuardingSiteRepository;
import com.securityco.repository.TierLimitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Page<GuardingSiteResponse> getByCategoryAndTier(String category, Integer tier, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GuardingSite> result = guardingSiteRepository
                .findByCategoryAndTierAndIsActiveTrueOrderByDisplayOrderAsc(category, tier, pageable);
        List<GuardingSiteResponse> content = result.getContent().stream()
                .map(this::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, result.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<GuardingSiteResponse> getByCategoryAndTier(String category, Integer tier) {
        return guardingSiteRepository
                .findByCategoryAndTierAndIsActiveTrueOrderByDisplayOrderAsc(category, tier)
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
                .orElseThrow(() -> new RuntimeException("Guarding site not found"));
        return toResponse(site);
    }

    @Transactional
    public GuardingSiteResponse create(GuardingSiteRequest request) {
        validateTierLimit(request.getCategory(), request.getTier(), null);

        GuardingSite site = new GuardingSite();
        site.setName(request.getName());
        site.setImageKey(request.getImageKey());
        site.setAddress(request.getAddress());
        site.setCategory(request.getCategory());
        site.setTier(request.getTier());
        site.setDisplayOrder(request.getDisplayOrder());
        site.setIsActive(request.getIsActive());

        GuardingSite saved = guardingSiteRepository.save(site);
        return toResponse(saved);
    }

    @Transactional
    public GuardingSiteResponse update(Integer id, GuardingSiteRequest request) {
        GuardingSite site = guardingSiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guarding site not found"));

        boolean tierChanged = !site.getTier().equals(request.getTier())
                || !site.getCategory().equals(request.getCategory());
        boolean activating = Boolean.TRUE.equals(request.getIsActive()) && !Boolean.TRUE.equals(site.getIsActive());
        if (tierChanged || activating) {
            validateTierLimit(request.getCategory(), request.getTier(), id);
        }

        site.setName(request.getName());
        site.setImageKey(request.getImageKey());
        site.setAddress(request.getAddress());
        site.setCategory(request.getCategory());
        site.setTier(request.getTier());
        site.setDisplayOrder(request.getDisplayOrder());
        site.setIsActive(request.getIsActive());

        GuardingSite saved = guardingSiteRepository.save(site);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Integer id) {
        GuardingSite site = guardingSiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guarding site not found"));
        guardingSiteRepository.delete(site);
    }

    private void validateTierLimit(String category, Integer tier, Integer excludeId) {
        int maxCount = tierLimitRepository.findByCategoryAndTier(category, tier)
                .map(TierLimit::getMaxCount)
                .orElse(200);

        long currentCount = guardingSiteRepository.countByCategoryAndTierAndIsActiveTrue(category, tier);
        if (excludeId != null) {
            Optional<GuardingSite> excluded = guardingSiteRepository.findById(excludeId);
            if (excluded.isPresent()
                    && excluded.get().getCategory().equals(category)
                    && excluded.get().getTier().equals(tier)
                    && Boolean.TRUE.equals(excluded.get().getIsActive())) {
                currentCount--;
            }
        }

        if (currentCount >= maxCount) {
            throw new RuntimeException("Tier limit reached for category '" + category + "' tier " + tier
                    + ". Maximum allowed: " + maxCount);
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
        response.setTier(site.getTier());
        response.setDisplayOrder(site.getDisplayOrder());
        response.setIsActive(site.getIsActive());
        response.setCreatedAt(site.getCreatedAt());
        response.setUpdatedAt(site.getUpdatedAt());
        return response;
    }
}
