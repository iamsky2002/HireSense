package com.sky.hiresense.admin.dto;

import com.sky.hiresense.user.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean enabled;
    private Instant createdAt;
}
