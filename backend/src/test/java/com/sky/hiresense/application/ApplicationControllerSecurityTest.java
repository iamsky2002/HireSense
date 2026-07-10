package com.sky.hiresense.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sky.hiresense.application.dto.ApplicantResponse;
import com.sky.hiresense.application.dto.ApplicationResponse;
import com.sky.hiresense.auth.JwtAuthFilter;
import com.sky.hiresense.auth.JwtUtil;
import com.sky.hiresense.config.SecurityConfig;
import com.sky.hiresense.job.EmploymentType;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ApplicationController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000"
})
class ApplicationControllerSecurityTest {

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    private User candidate;
    private User employer;

    @Autowired
    ApplicationControllerSecurityTest(MockMvc mockMvc, ObjectMapper objectMapper, JwtUtil jwtUtil) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.jwtUtil = jwtUtil;
    }

    @BeforeEach
    void setUp() {
        candidate = User.builder()
                .id(1L)
                .email("candidate@test.com")
                .fullName("Candidate User")
                .passwordHash("hash")
                .role(Role.CANDIDATE)
                .build();

        employer = User.builder()
                .id(2L)
                .email("employer@test.com")
                .fullName("Employer User")
                .passwordHash("hash")
                .role(Role.EMPLOYER)
                .build();
    }

    @Test
    void applyRejectsMissingToken() throws Exception {
        mockMvc.perform(post("/api/jobs/10/apply"))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateCanApplyToJob() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(applicationService.apply(10L, candidate)).thenReturn(applicationResponse());

        mockMvc.perform(post("/api/jobs/10/apply")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.applicationId").value(100L))
                .andExpect(jsonPath("$.jobId").value(10L));
    }

    @Test
    void employerCannotApplyToJob() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(post("/api/jobs/10/apply")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(applicationService, never()).apply(any(), any());
    }

    @Test
    void candidateCanSeeOwnApplications() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(applicationService.myApplications(candidate)).thenReturn(List.of(applicationResponse()));

        mockMvc.perform(get("/api/applications/me")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].applicationId").value(100L));
    }

    @Test
    void candidateCannotSeeJobApplicants() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(get("/api/jobs/10/applicants")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isForbidden());

        verify(applicationService, never()).applicantsForJob(any(), any());
    }

    @Test
    void employerCanSeeJobApplicants() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));
        when(applicationService.applicantsForJob(10L, employer)).thenReturn(List.of(applicantResponse()));

        mockMvc.perform(get("/api/jobs/10/applicants")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].applicationId").value(100L))
                .andExpect(jsonPath("$[0].candidateId").value(1L));
    }

    @Test
    void employerCanUpdateApplicationStatus() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));
        when(applicationService.updateStatus(eq(100L), eq(ApplicationStatus.SHORTLISTED), eq(null), eq(employer)))
                .thenReturn(shortlistedResponse());

        mockMvc.perform(patch("/api/applications/100/status")
                        .header("Authorization", bearer(employer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "SHORTLISTED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));
    }

    @Test
    void candidateCannotUpdateApplicationStatus() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(patch("/api/applications/100/status")
                        .header("Authorization", bearer(candidate))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "SHORTLISTED"))))
                .andExpect(status().isForbidden());

        verify(applicationService, never()).updateStatus(any(), any(), any(), any());
    }

    private String bearer(User user) {
        return "Bearer " + jwtUtil.generateToken(user);
    }

    private ApplicationResponse applicationResponse() {
        return ApplicationResponse.builder()
                .applicationId(100L)
                .jobId(10L)
                .jobTitle("Backend Developer")
                .company("Sky Tech")
                .location("Remote")
                .type(EmploymentType.FULL_TIME)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(Instant.parse("2026-07-10T10:00:00Z"))
                .build();
    }

    private ApplicationResponse shortlistedResponse() {
        return ApplicationResponse.builder()
                .applicationId(100L)
                .jobId(10L)
                .jobTitle("Backend Developer")
                .company("Sky Tech")
                .location("Remote")
                .type(EmploymentType.FULL_TIME)
                .status(ApplicationStatus.SHORTLISTED)
                .appliedAt(Instant.parse("2026-07-10T10:00:00Z"))
                .build();
    }

    private ApplicantResponse applicantResponse() {
        return ApplicantResponse.builder()
                .applicationId(100L)
                .candidateId(1L)
                .candidateName("Candidate User")
                .candidateEmail("candidate@test.com")
                .status(ApplicationStatus.APPLIED)
                .appliedAt(Instant.parse("2026-07-10T10:00:00Z"))
                .build();
    }
}
