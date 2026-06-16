package com.sky.hiresense.candidate.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class ProfileResponse {
    private Long userId;
    private String fullName;     // from User
    private String email;        // from User
    private String headline;
    private Integer experienceYears;
    private String expectedCtc;
    private String resumeUrl;
    private Set<String> skills;  // skill names only
}
