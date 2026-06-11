package com.sky.hiresense.auth;

import com.sky.hiresense.auth.dto.AuthResponse;
import com.sky.hiresense.auth.dto.LoginRequest;
import com.sky.hiresense.auth.dto.RegisterRequest;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

// Auth ki saari business logic yahan (controller patla rehta hai)
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        // 1) Email pehle se to registered nahi?
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // 2) Password BCrypt se hash karke user banao
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .build();

        // 3) DB me save
        User saved = userRepository.save(user);

        // 4) Response (token register pe nahi — login pe milega)
        return toResponse(saved, null);
    }

    public AuthResponse login(LoginRequest req) {
        // 1) Email se user dhoondo
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        // 2) Password verify (raw vs stored hash) — ek hi error message (security)
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // 3) JWT token banao aur response me bhejo
        String token = jwtUtil.generateToken(user);
        return toResponse(user, token);
    }

    // User -> AuthResponse (token optional)
    private AuthResponse toResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
