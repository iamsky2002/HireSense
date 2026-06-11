package com.sky.hiresense.user;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Logged-in user ki info + ek RBAC test endpoint
@RestController
@RequestMapping("/api")
public class MeController {

    // Current logged-in user (token se aaya). Protected — token ke bina 401/403.
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal User user) {
        return Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole()
        );
    }

    // RBAC test: sirf EMPLOYER access kar sakta hai
    @GetMapping("/employer/ping")
    @PreAuthorize("hasRole('EMPLOYER')")
    public String employerOnly() {
        return "Hello, employer! RBAC works.";
    }
}
