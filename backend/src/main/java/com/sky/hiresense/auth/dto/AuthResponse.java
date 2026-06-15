package com.sky.hiresense.auth.dto;

import com.sky.hiresense.user.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;   // set on login, null on register
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
}
