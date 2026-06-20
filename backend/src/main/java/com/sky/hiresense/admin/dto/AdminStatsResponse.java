package com.sky.hiresense.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long candidates;
    private long employers;
    private long admins;
    private long totalJobs;
    private long totalApplications;
}
