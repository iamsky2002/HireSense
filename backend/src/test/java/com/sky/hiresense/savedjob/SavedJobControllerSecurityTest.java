package com.sky.hiresense.savedjob;

import com.sky.hiresense.auth.JwtAuthFilter;
import com.sky.hiresense.auth.JwtUtil;
import com.sky.hiresense.config.SecurityConfig;
import com.sky.hiresense.job.EmploymentType;
import com.sky.hiresense.job.dto.JobResponse;
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

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SavedJobController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000"
})
class SavedJobControllerSecurityTest {

    @MockBean
    private SavedJobService savedJobService;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final JwtUtil jwtUtil;

    private User candidate;
    private User employer;

    @Autowired
    SavedJobControllerSecurityTest(MockMvc mockMvc, JwtUtil jwtUtil) {
        this.mockMvc = mockMvc;
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
    void saveRejectsMissingToken() throws Exception {
        mockMvc.perform(post("/api/jobs/10/save"))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateCanSaveJob() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(post("/api/jobs/10/save")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isCreated());

        verify(savedJobService).save(10L, candidate);
    }

    @Test
    void employerCannotSaveJob() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(post("/api/jobs/10/save")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(savedJobService, never()).save(any(), any());
    }

    @Test
    void candidateCanUnsaveJob() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(delete("/api/jobs/10/save")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isNoContent());

        verify(savedJobService).unsave(10L, candidate);
    }

    @Test
    void employerCannotUnsaveJob() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(delete("/api/jobs/10/save")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(savedJobService, never()).unsave(any(), any());
    }

    @Test
    void candidateCanListSavedJobs() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(savedJobService.listSaved(candidate)).thenReturn(List.of(jobResponse()));

        mockMvc.perform(get("/api/me/saved-jobs")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L))
                .andExpect(jsonPath("$[0].title").value("Backend Developer"));
    }

    @Test
    void employerCannotListSavedJobs() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(get("/api/me/saved-jobs")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(savedJobService, never()).listSaved(any());
    }

    private String bearer(User user) {
        return "Bearer " + jwtUtil.generateToken(user);
    }

    private JobResponse jobResponse() {
        return JobResponse.builder()
                .id(10L)
                .title("Backend Developer")
                .description("Build APIs with Spring Boot")
                .location("Remote")
                .experience("2 years")
                .type(EmploymentType.FULL_TIME)
                .salaryMin(800000)
                .salaryMax(1200000)
                .company("Sky Tech")
                .skills(Set.of("Java", "Spring Boot"))
                .build();
    }
}
