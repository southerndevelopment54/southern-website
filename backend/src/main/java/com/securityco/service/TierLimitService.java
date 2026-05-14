package com.securityco.service;

import com.securityco.dto.TierLimitRequest;
import com.securityco.dto.TierLimitResponse;
import com.securityco.model.TierLimit;
import com.securityco.repository.TierLimitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TierLimitService {

    private final TierLimitRepository tierLimitRepository;

    @Transactional(readOnly = true)
    public List<TierLimitResponse> getAll() {
        return tierLimitRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TierLimitResponse getById(Integer id) {
        TierLimit limit = tierLimitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tier limit not found"));
        return toResponse(limit);
    }

    @Transactional
    public TierLimitResponse update(Integer id, TierLimitRequest request) {
        TierLimit limit = tierLimitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tier limit not found"));

        limit.setCategory(request.getCategory());
        limit.setTier(request.getTier());
        limit.setMaxCount(request.getMaxCount());

        TierLimit saved = tierLimitRepository.save(limit);
        return toResponse(saved);
    }

    private TierLimitResponse toResponse(TierLimit limit) {
        TierLimitResponse response = new TierLimitResponse();
        response.setId(limit.getId());
        response.setCategory(limit.getCategory());
        response.setTier(limit.getTier());
        response.setMaxCount(limit.getMaxCount());
        response.setCreatedAt(limit.getCreatedAt());
        response.setUpdatedAt(limit.getUpdatedAt());
        return response;
    }
}
