package com.securityco.service;

import com.securityco.model.AdminUser;
import com.securityco.model.AuditLog;
import com.securityco.repository.AdminUserRepository;
import com.securityco.repository.AuditLogRepository;
import com.securityco.security.AdminUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AdminUserRepository adminUserRepository;

    @Transactional
    public void log(String action, String entityType, Integer entityId, Map<String, Object> details, String ipAddress) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        Integer adminUserId = null;
        if (auth != null && auth.getPrincipal() instanceof AdminUserDetails user) {
            adminUserId = user.getId();
        }

        AuditLog log = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .adminUser(adminUserId != null ? adminUserRepository.findById(adminUserId).orElse(null) : null)
                .details(details)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }
}
