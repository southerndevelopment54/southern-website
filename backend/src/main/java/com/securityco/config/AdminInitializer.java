package com.securityco.config;

import com.securityco.model.AdminUser;
import com.securityco.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Automatically creates the admin user on first startup from environment variables.
 * Reads ADMIN_USERNAME, ADMIN_PASSWORD_HASH, and ADMIN_EMAIL from .env
 * and inserts the admin into PostgreSQL if it doesn't already exist.
 *
 * No manual script required — just set the values in .env and start the app.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;

    @Value("${ADMIN_USERNAME:admin}")
    private String adminUsername;

    @Value("${ADMIN_PASSWORD_HASH:}")
    private String adminPasswordHash;

    @Value("${ADMIN_EMAIL:admin@localhost}")
    private String adminEmail;

    @Override
    public void run(String... args) {
        if (adminPasswordHash == null || adminPasswordHash.isBlank()) {
            log.warn("ADMIN_PASSWORD_HASH not set in environment. Skipping admin auto-creation.");
            log.warn("To create an admin user, generate a BCrypt hash and set ADMIN_PASSWORD_HASH in .env");
            return;
        }

        Optional<AdminUser> existing = adminUserRepository.findByUsername(adminUsername);

        if (existing.isPresent()) {
            log.info("Admin user '{}' already exists. Skipping auto-creation.", adminUsername);
            return;
        }

        AdminUser admin = AdminUser.builder()
                .username(adminUsername)
                .passwordHash(adminPasswordHash)
                .fullName("System Administrator")
                .email(adminEmail)
                .role("admin")
                .isActive(true)
                .build();

        adminUserRepository.save(admin);
        log.info("Admin user '{}' created successfully.", adminUsername);
    }
}
