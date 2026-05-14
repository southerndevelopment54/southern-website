package com.securityco.service;

import com.securityco.dto.ContactRequest;
import com.securityco.dto.ContactResponse;
import com.securityco.model.ContactMessage;
import com.securityco.repository.ContactMessageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");

    @Transactional
    public ContactResponse save(ContactRequest request, String ipAddress, String userAgent) {
        ContactMessage msg = ContactMessage.builder()
                .name(sanitize(request.getName()))
                .email(request.getEmail().trim().toLowerCase())
                .company(sanitize(request.getCompany()))
                .phone(request.getPhone())
                .serviceType(request.getServiceType())
                .message(sanitize(request.getMessage()))
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .isRead(false)
                .build();
        return toResponse(contactMessageRepository.save(msg));
    }

    @Transactional(readOnly = true)
    public Page<ContactResponse> listAll(Pageable pageable) {
        return contactMessageRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ContactResponse getById(Integer id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inquiry not found"));
        return toResponse(msg);
    }

    @Transactional
    public ContactResponse markAsRead(Integer id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inquiry not found"));
        msg.setIsRead(true);
        return toResponse(contactMessageRepository.save(msg));
    }

    @Transactional
    public void delete(Integer id) {
        contactMessageRepository.deleteById(id);
    }

    private String sanitize(String input) {
        if (input == null) return null;
        // Strip HTML tags to prevent XSS
        String noTags = HTML_TAG_PATTERN.matcher(input).replaceAll("");
        // Normalize whitespace
        return noTags.trim().replaceAll("\\s+", " ");
    }

    private ContactResponse toResponse(ContactMessage msg) {
        ContactResponse response = new ContactResponse();
        response.setId(msg.getId());
        response.setName(msg.getName());
        response.setEmail(msg.getEmail());
        response.setCompany(msg.getCompany());
        response.setPhone(msg.getPhone());
        response.setServiceType(msg.getServiceType());
        response.setMessage(msg.getMessage());
        response.setIpAddress(msg.getIpAddress());
        response.setUserAgent(msg.getUserAgent());
        response.setIsRead(msg.getIsRead());
        response.setCreatedAt(msg.getCreatedAt());
        return response;
    }
}
