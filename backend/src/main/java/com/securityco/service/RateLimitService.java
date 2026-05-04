package com.securityco.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final ConcurrentHashMap<String, Instant> lastSubmission = new ConcurrentHashMap<>();
    private static final Duration COOLDOWN = Duration.ofMinutes(1);

    public boolean isAllowed(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            return true;
        }
        Instant now = Instant.now();
        Instant last = lastSubmission.get(ipAddress);
        if (last == null || Duration.between(last, now).compareTo(COOLDOWN) >= 0) {
            lastSubmission.put(ipAddress, now);
            return true;
        }
        return false;
    }
}
