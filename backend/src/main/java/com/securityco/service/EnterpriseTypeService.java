package com.securityco.service;

import com.securityco.dto.EnterpriseTypeResponse;
import com.securityco.model.EnterpriseType;
import com.securityco.repository.EnterpriseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnterpriseTypeService {

    private final EnterpriseTypeRepository enterpriseTypeRepository;

    @Transactional(readOnly = true)
    public List<EnterpriseTypeResponse> getAll() {
        return enterpriseTypeRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private EnterpriseTypeResponse toResponse(EnterpriseType type) {
        EnterpriseTypeResponse response = new EnterpriseTypeResponse();
        response.setId(type.getId());
        response.setTypeName(type.getTypeName());
        response.setDisplayOrder(type.getDisplayOrder());
        response.setCreatedAt(type.getCreatedAt());
        return response;
    }
}
