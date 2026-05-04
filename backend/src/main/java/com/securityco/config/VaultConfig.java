package com.securityco.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.vault.annotation.VaultPropertySource;

@Configuration
@ConditionalOnProperty(name = "spring.cloud.vault.enabled", havingValue = "true")
@VaultPropertySource("secret/security-co")
@Slf4j
public class VaultConfig {
    public VaultConfig() {
        log.info("Vault configuration enabled");
    }
}
