package com.sky.hiresense.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sky.hiresense.auth.dto.AuthResponse;
import com.sky.hiresense.auth.dto.LoginRequest;
import com.sky.hiresense.auth.dto.RegisterRequest;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    AuthControllerTest(MockMvc mockMvc, ObjectMapper objectMapper) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
    }

    @Test
    void registerReturnsCreated() throws Exception {
        when(authService.register(any())).thenReturn(registerResponse());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(1L))
                .andExpect(jsonPath("$.email").value("candidate@test.com"))
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    void registerRejectsInvalidEmail() throws Exception {
        RegisterRequest request = registerRequest();
        request.setEmail("bad-email");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any());
    }

    @Test
    void registerRejectsShortPassword() throws Exception {
        RegisterRequest request = registerRequest();
        request.setPassword("123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any());
    }

    @Test
    void loginReturnsOk() throws Exception {
        when(authService.login(any())).thenReturn(loginResponse());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.role").value("CANDIDATE"));
    }

    @Test
    void loginRejectsBlankPassword() throws Exception {
        LoginRequest request = loginRequest();
        request.setPassword("");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).login(any());
    }

    private RegisterRequest registerRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Candidate User");
        request.setEmail("candidate@test.com");
        request.setPassword("secret123");
        request.setRole(Role.CANDIDATE);
        return request;
    }

    private LoginRequest loginRequest() {
        LoginRequest request = new LoginRequest();
        request.setEmail("candidate@test.com");
        request.setPassword("secret123");
        return request;
    }

    private AuthResponse registerResponse() {
        return AuthResponse.builder()
                .userId(1L)
                .email("candidate@test.com")
                .fullName("Candidate User")
                .role(Role.CANDIDATE)
                .build();
    }

    private AuthResponse loginResponse() {
        return AuthResponse.builder()
                .token("jwt-token")
                .userId(1L)
                .email("candidate@test.com")
                .fullName("Candidate User")
                .role(Role.CANDIDATE)
                .build();
    }
}
