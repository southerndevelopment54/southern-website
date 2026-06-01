package com.securityco.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RateLimitService {

    // Global limit: 3 submissions per 5 minutes per IP
    private final ConcurrentHashMap<String, List<Instant>> globalSubmissions = new ConcurrentHashMap<>();
    private static final int GLOBAL_MAX = 3;
    private static final Duration GLOBAL_WINDOW = Duration.ofMinutes(5);

    // Per-vacancy limit: 2 submissions per 1 minute per IP per vacancy
    private final ConcurrentHashMap<String, List<Instant>> vacancySubmissions = new ConcurrentHashMap<>();
    private static final int VACANCY_MAX = 2;
    private static final Duration VACANCY_WINDOW = Duration.ofMinutes(1);

    private void cleanupOld(List<Instant> timestamps, Duration window, Instant now) {
        timestamps.removeIf(t -> Duration.between(t, now).compareTo(window) > 0);
    }

    public boolean isAllowedGlobal(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            return true;
        }
        Instant now = Instant.now();
        List<Instant> timestamps = globalSubmissions.computeIfAbsent(ipAddress, k -> new CopyOnWriteArrayList<>());
        cleanupOld(timestamps, GLOBAL_WINDOW, now);
        if (timestamps.size() < GLOBAL_MAX) {
            timestamps.add(now);
            return true;
        }
        return false;
    }

    public boolean isAllowedPerVacancy(String ipAddress, Integer vacancyId) {
        if (ipAddress == null || ipAddress.isBlank() || vacancyId == null) {
            return true;
        }
        String key = ipAddress + ":" + vacancyId;
        Instant now = Instant.now();
        List<Instant> timestamps = vacancySubmissions.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>());
        cleanupOld(timestamps, VACANCY_WINDOW, now);
        if (timestamps.size() < VACANCY_MAX) {
            timestamps.add(now);
            return true;
        }
        return false;
    }
}
