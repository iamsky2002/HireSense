package com.sky.hiresense.application.dto;

import com.sky.hiresense.application.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {

    @NotNull
    private ApplicationStatus status;
}
