package com.sky.hiresense.application.dto;

import com.sky.hiresense.application.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApplicantResponse {
    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private ApplicationStatus status;
    private String rejectionReason;
    private ApplicationStatus rejectedFromStage;
    private Instant appliedAt;
}
