package com.securityco.dto;

import lombok.Data;

import java.util.Map;

@Data
public class DashboardStats {
    private long totalVacancies;
    private long activeVacancies;
    private long totalSubmissions;
    private long newSubmissionsThisWeek;
    private Map<String, Long> submissionsByStatus;
}
