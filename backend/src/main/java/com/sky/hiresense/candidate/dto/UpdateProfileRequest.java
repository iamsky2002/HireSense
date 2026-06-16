package com.sky.hiresense.candidate.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UpdateProfileRequest {
    private String headline;
    private Integer experienceYears;
    private String expectedCtc;
    private Set<String> skills;
}
