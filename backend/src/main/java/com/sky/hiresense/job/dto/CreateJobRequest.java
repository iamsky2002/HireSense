package com.sky.hiresense.job.dto;

import com.sky.hiresense.job.EmploymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class CreateJobRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String location;

    private String experience;

    @NotNull
    private EmploymentType type;

    private Integer salaryMin;

    private Integer salaryMax;

    // just skill names; service maps them to Skill entities (get-or-create)
    private Set<String> skills;
}
