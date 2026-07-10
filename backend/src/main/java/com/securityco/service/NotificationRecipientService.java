package com.securityco.service;

import com.securityco.dto.NotificationRecipientRequest;
import com.securityco.dto.NotificationRecipientResponse;
import com.securityco.model.NotificationRecipient;
import com.securityco.repository.NotificationRecipientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationRecipientService {

    private final NotificationRecipientRepository repository;

    public List<NotificationRecipientResponse> findAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NotificationRecipientResponse create(NotificationRecipientRequest request) {
        if (repository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("A recipient with this email already exists");
        }
        NotificationRecipient recipient = NotificationRecipient.builder()
                .email(request.getEmail().trim())
                .name(request.getName() != null ? request.getName().trim() : null)
                .isActive(request.getIsActive())
                .build();
        return toResponse(repository.save(recipient));
    }

    @Transactional
    public NotificationRecipientResponse update(Integer id, NotificationRecipientRequest request) {
        NotificationRecipient recipient = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

        String newEmail = request.getEmail().trim();
        if (!newEmail.equalsIgnoreCase(recipient.getEmail()) && repository.existsByEmailIgnoreCase(newEmail)) {
            throw new IllegalArgumentException("A recipient with this email already exists");
        }

        recipient.setEmail(newEmail);
        recipient.setName(request.getName() != null ? request.getName().trim() : null);
        recipient.setIsActive(request.getIsActive());

        return toResponse(repository.save(recipient));
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Recipient not found");
        }
        repository.deleteById(id);
    }

    private NotificationRecipientResponse toResponse(NotificationRecipient recipient) {
        NotificationRecipientResponse response = new NotificationRecipientResponse();
        response.setId(recipient.getId());
        response.setEmail(recipient.getEmail());
        response.setName(recipient.getName());
        response.setIsActive(recipient.getIsActive());
        response.setCreatedAt(recipient.getCreatedAt());
        return response;
    }
}
