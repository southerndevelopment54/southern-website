package com.securityco.service;

import com.securityco.dto.ClientRequest;
import com.securityco.dto.ClientResponse;
import com.securityco.model.Client;
import com.securityco.model.EnterpriseType;
import com.securityco.repository.ClientRepository;
import com.securityco.repository.EnterpriseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final EnterpriseTypeRepository enterpriseTypeRepository;
    private final MinioService minioService;

    private static final int MAX_FEATURED_CLIENTS = 8;

    @Transactional(readOnly = true)
    public List<ClientResponse> getAll() {
        return clientRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> getAllAdmin() {
        return clientRepository.findAll()
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
    public List<ClientResponse> getFeatured() {
        return clientRepository.findByIsFeaturedTrueAndIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientResponse getById(Integer id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return toResponse(client);
    }

    @Transactional
    public ClientResponse create(ClientRequest request) {
        if (Boolean.TRUE.equals(request.getIsFeatured())) {
            long featuredCount = clientRepository.countByIsFeaturedTrueAndIsActiveTrue();
            if (featuredCount >= MAX_FEATURED_CLIENTS) {
                throw new RuntimeException("Maximum of " + MAX_FEATURED_CLIENTS + " featured clients allowed");
            }
        }

        Client client = new Client();
        client.setName(request.getName());
        client.setLogoKey(request.getLogoKey());
        client.setIsFeatured(request.getIsFeatured());
        client.setDisplayOrder(request.getDisplayOrder());
        client.setIsActive(request.getIsActive());

        if (request.getEnterpriseTypeId() != null) {
            EnterpriseType type = enterpriseTypeRepository.findById(request.getEnterpriseTypeId())
                    .orElseThrow(() -> new RuntimeException("Enterprise type not found"));
            client.setEnterpriseType(type);
        }

        Client saved = clientRepository.save(client);
        return toResponse(saved);
    }

    @Transactional
    public ClientResponse update(Integer id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        boolean becomingFeatured = Boolean.TRUE.equals(request.getIsFeatured()) && !Boolean.TRUE.equals(client.getIsFeatured());
        if (becomingFeatured) {
            long featuredCount = clientRepository.countByIsFeaturedTrueAndIsActiveTrue();
            if (featuredCount >= MAX_FEATURED_CLIENTS) {
                throw new RuntimeException("Maximum of " + MAX_FEATURED_CLIENTS + " featured clients allowed");
            }
        }

        client.setName(request.getName());
        client.setLogoKey(request.getLogoKey());
        client.setIsFeatured(request.getIsFeatured());
        client.setDisplayOrder(request.getDisplayOrder());
        client.setIsActive(request.getIsActive());

        if (request.getEnterpriseTypeId() != null) {
            EnterpriseType type = enterpriseTypeRepository.findById(request.getEnterpriseTypeId())
                    .orElseThrow(() -> new RuntimeException("Enterprise type not found"));
            client.setEnterpriseType(type);
        } else {
            client.setEnterpriseType(null);
        }

        Client saved = clientRepository.save(client);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Integer id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        clientRepository.delete(client);
    }

    private ClientResponse toResponse(Client client) {
        ClientResponse response = new ClientResponse();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setLogoKey(client.getLogoKey());
        if (client.getLogoKey() != null && !client.getLogoKey().isBlank()) {
            response.setLogoUrl(minioService.getPresignedUrl(client.getLogoKey()));
        }
        if (client.getEnterpriseType() != null) {
            response.setEnterpriseTypeId(client.getEnterpriseType().getId());
            response.setEnterpriseTypeName(client.getEnterpriseType().getTypeName());
        }
        response.setIsFeatured(client.getIsFeatured());
        response.setDisplayOrder(client.getDisplayOrder());
        response.setIsActive(client.getIsActive());
        response.setCreatedAt(client.getCreatedAt());
        response.setUpdatedAt(client.getUpdatedAt());
        return response;
    }
}
