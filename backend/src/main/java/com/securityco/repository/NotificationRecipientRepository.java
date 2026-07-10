package com.securityco.repository;

import com.securityco.model.NotificationRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, Integer> {

    List<NotificationRecipient> findByIsActiveTrue();

    Optional<NotificationRecipient> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
