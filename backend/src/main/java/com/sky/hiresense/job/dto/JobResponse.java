package com.sky.hiresense.job.dto;

import com.sky.hiresense.job.EmploymentType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String experience;
    private EmploymentType type;
    private Integer salaryMin;
    private Integer salaryMax;
    private Instant postedAt;

    // just the company name, not the full Company object
    private String company;

    private Set<String> skills;
}
