package com.sky.hiresense.user;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// returns the currently logged-in user's info
@RestController
@RequestMapping("/api")
public class MeController {

    // current user, read from the JWT
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal User user) {
        return Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole()
        );
    }
}
