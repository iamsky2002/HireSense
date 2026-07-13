package com.sky.hiresense.admin;

import com.sky.hiresense.admin.dto.AdminStatsResponse;
import com.sky.hiresense.admin.dto.AdminUserResponse;
import com.sky.hiresense.auth.JwtAuthFilter;
import com.sky.hiresense.auth.JwtUtil;
import com.sky.hiresense.config.SecurityConfig;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000"
})
class AdminControllerSecurityTest {

    @MockBean
    private AdminService adminService;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final JwtUtil jwtUtil;

    private User admin;
    private User candidate;
    private User employer;

    @Autowired
    AdminControllerSecurityTest(MockMvc mockMvc, JwtUtil jwtUtil) {
        this.mockMvc = mockMvc;
        this.jwtUtil = jwtUtil;
    }

    @BeforeEach
    void setUp() {
        admin = user(1L, "admin@test.com", "Admin User", Role.ADMIN);
        candidate = user(2L, "candidate@test.com", "Candidate User", Role.CANDIDATE);
        employer = user(3L, "employer@test.com", "Employer User", Role.EMPLOYER);
    }

    @Test
    void statsRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateCannotSeeStats() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isForbidden());

        verify(adminService, never()).stats();
    }

    @Test
    void employerCannotSeeStats() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(adminService, never()).stats();
    }

    @Test
    void adminCanSeeStats() throws Exception {
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(adminService.stats()).thenReturn(statsResponse());

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", bearer(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(10L))
                .andExpect(jsonPath("$.totalJobs").value(5L));
    }

    @Test
    void adminCanListUsers() throws Exception {
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(adminService.listUsers()).thenReturn(List.of(userResponse(candidate)));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", bearer(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2L))
                .andExpect(jsonPath("$[0].role").value("CANDIDATE"));
    }

    @Test
    void candidateCannotListUsers() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isForbidden());

        verify(adminService, never()).listUsers();
    }

    @Test
    void adminCanDisableUser() throws Exception {
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(adminService.setEnabled(2L, false, admin)).thenReturn(disabledUserResponse(candidate));

        mockMvc.perform(patch("/api/admin/users/2/enabled")
                        .param("enabled", "false")
                        .header("Authorization", bearer(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.enabled").value(false));
    }

    @Test
    void employerCannotDisableUser() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(patch("/api/admin/users/2/enabled")
                        .param("enabled", "false")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(adminService, never()).setEnabled(any(), any(Boolean.class), any());
    }

    private User user(Long id, String email, String fullName, Role role) {
        return User.builder()
                .id(id)
                .email(email)
                .fullName(fullName)
                .passwordHash("hash")
                .role(role)
                .build();
    }

    private String bearer(User user) {
        return "Bearer " + jwtUtil.generateToken(user);
    }

    private AdminStatsResponse statsResponse() {
        return AdminStatsResponse.builder()
                .totalUsers(10)
                .candidates(6)
                .employers(3)
                .admins(1)
                .totalJobs(5)
                .totalApplications(8)
                .build();
    }

    private AdminUserResponse userResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(true)
                .createdAt(Instant.parse("2026-07-13T10:00:00Z"))
                .build();
    }

    private AdminUserResponse disabledUserResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(false)
                .createdAt(Instant.parse("2026-07-13T10:00:00Z"))
                .build();
    }
}
