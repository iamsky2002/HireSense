package com.sky.hiresense.application.dto;

import com.sky.hiresense.application.ApplicationStatus;
import com.sky.hiresense.job.EmploymentType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApplicationResponse {
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String company;     // just the company name
    private String location;
    private EmploymentType type;
    private ApplicationStatus status;
    private Instant appliedAt;
}
