package com.sky.hiresense.candidate;

import com.sky.hiresense.auth.JwtAuthFilter;
import com.sky.hiresense.auth.JwtUtil;
import com.sky.hiresense.candidate.dto.CandidateSummaryResponse;
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

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CandidateController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000"
})
class CandidateControllerSecurityTest {

    @MockBean
    private ProfileService profileService;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final JwtUtil jwtUtil;

    private User candidate;
    private User employer;

    @Autowired
    CandidateControllerSecurityTest(MockMvc mockMvc, JwtUtil jwtUtil) {
        this.mockMvc = mockMvc;
        this.jwtUtil = jwtUtil;
    }

    @BeforeEach
    void setUp() {
        candidate = user(1L, "candidate@test.com", "Candidate User", Role.CANDIDATE);
        employer = user(2L, "employer@test.com", "Employer User", Role.EMPLOYER);
    }

    @Test
    void listRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/candidates"))
                .andExpect(status().isForbidden());
    }

    @Test
    void employerCanListCandidates() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));
        when(profileService.listCandidates()).thenReturn(List.of(candidateSummary()));

        mockMvc.perform(get("/api/candidates")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(1L))
                .andExpect(jsonPath("$[0].headline").value("Java Backend Developer"));
    }

    @Test
    void candidateCannotListCandidates() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(get("/api/candidates")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isForbidden());

        verify(profileService, never()).listCandidates();
    }

    @Test
    void employerCanGetCandidate() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));
        when(profileService.getCandidate(1L)).thenReturn(candidateSummary());

        mockMvc.perform(get("/api/candidates/1")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1L))
                .andExpect(jsonPath("$.fullName").value("Candidate User"));
    }

    @Test
    void candidateCannotGetCandidate() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(get("/api/candidates/1")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isForbidden());

        verify(profileService, never()).getCandidate(any());
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

    private CandidateSummaryResponse candidateSummary() {
        return CandidateSummaryResponse.builder()
                .userId(1L)
                .fullName("Candidate User")
                .headline("Java Backend Developer")
                .experienceYears(2)
                .expectedCtc("12 LPA")
                .skills(Set.of("Java", "Spring Boot"))
                .build();
    }
}
