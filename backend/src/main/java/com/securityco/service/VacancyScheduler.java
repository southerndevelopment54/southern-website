package com.securityco.service;

import com.securityco.model.Vacancy;
import com.securityco.repository.VacancyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class VacancyScheduler {

    private final VacancyRepository vacancyRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deactivateExpiredVacancies() {
        var expired = vacancyRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsActive())
                        && v.getExpiresAt() != null
                        && v.getExpiresAt().isBefore(LocalDate.now()))
                .toList();

        for (Vacancy v : expired) {
            v.setIsActive(false);
            vacancyRepository.save(v);
        }

        if (!expired.isEmpty()) {
            log.info("Deactivated {} expired vacancies", expired.size());
        }
    }
}
