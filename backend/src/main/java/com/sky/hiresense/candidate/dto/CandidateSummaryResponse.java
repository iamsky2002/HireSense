package com.sky.hiresense.candidate.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

// candidate summary for Find Talent, no email
@Data
@Builder
public class CandidateSummaryResponse {
    private Long userId;
    private String fullName;
    private String headline;
    private Integer experienceYears;
    private String expectedCtc;
    private Set<String> skills;
}
