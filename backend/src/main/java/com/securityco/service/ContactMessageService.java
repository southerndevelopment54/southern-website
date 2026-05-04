package com.securityco.service;

import com.securityco.dto.ContactRequest;
import com.securityco.model.ContactMessage;
import com.securityco.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public ContactMessage save(ContactRequest request) {
        ContactMessage msg = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .message(request.getMessage())
                .build();
        return contactMessageRepository.save(msg);
    }
}
