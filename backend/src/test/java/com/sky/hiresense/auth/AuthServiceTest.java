package com.sky.hiresense.auth;

import com.sky.hiresense.auth.dto.AuthResponse;
import com.sky.hiresense.auth.dto.LoginRequest;
import com.sky.hiresense.auth.dto.RegisterRequest;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFullName("Test User");
        registerRequest.setEmail("test@hiresense.com");
        registerRequest.setPassword("secret123");
        registerRequest.setRole(Role.CANDIDATE);
    }

    @Test
    void register_savesUser_andReturnsNoToken() {
        when(userRepository.existsByEmail("test@hiresense.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        AuthResponse res = authService.register(registerRequest);

        assertThat(res.getEmail()).isEqualTo("test@hiresense.com");
        // no token on register, user has to log in separately
        assertThat(res.getToken()).isNull();
    }

    @Test
    void register_withExistingEmail_throwsConflict() {
        when(userRepository.existsByEmail("test@hiresense.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Email already registered");
    }

    @Test
    void register_withAdminRole_throwsBadRequest() {
        // admin public signup se nahi ban sakta
        registerRequest.setRole(Role.ADMIN);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid role");
    }

    @Test
    void login_withCorrectPassword_returnsToken() {
        User user = User.builder()
                .id(1L)
                .email("test@hiresense.com")
                .passwordHash("hashed")
                .fullName("Test User")
                .role(Role.CANDIDATE)
                .build();

        when(userRepository.findByEmail("test@hiresense.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(user)).thenReturn("jwt-token");

        LoginRequest req = new LoginRequest();
        req.setEmail("test@hiresense.com");
        req.setPassword("secret123");

        AuthResponse res = authService.login(req);

        assertThat(res.getToken()).isEqualTo("jwt-token");
    }

    @Test
    void login_withWrongPassword_throwsUnauthorized() {
        User user = User.builder()
                .id(1L)
                .email("test@hiresense.com")
                .passwordHash("hashed")
                .role(Role.CANDIDATE)
                .build();

        when(userRepository.findByEmail("test@hiresense.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        LoginRequest req = new LoginRequest();
        req.setEmail("test@hiresense.com");
        req.setPassword("wrong");

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
