package com.securityco.service;

import com.securityco.dto.ClientRequest;
import com.securityco.dto.ClientResponse;
import com.securityco.model.Client;
import com.securityco.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum of " + MAX_FEATURED_CLIENTS + " featured clients allowed");
            }
        }

        Client client = new Client();
        client.setName(request.getName());
        client.setLogoKey(request.getLogoKey());
        client.setIsFeatured(request.getIsFeatured());
        client.setDisplayOrder(request.getDisplayOrder());
        client.setIsActive(request.getIsActive());

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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum of " + MAX_FEATURED_CLIENTS + " featured clients allowed");
            }
        }

        client.setName(request.getName());
        client.setLogoKey(request.getLogoKey());
        client.setIsFeatured(request.getIsFeatured());
        client.setDisplayOrder(request.getDisplayOrder());
        client.setIsActive(request.getIsActive());

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
            response.setLogoUrl(minioService.getPublicUrl(client.getLogoKey()));
        }
        response.setIsFeatured(client.getIsFeatured());
        response.setDisplayOrder(client.getDisplayOrder());
        response.setIsActive(client.getIsActive());
        response.setCreatedAt(client.getCreatedAt());
        response.setUpdatedAt(client.getUpdatedAt());
        return response;
    }
}
