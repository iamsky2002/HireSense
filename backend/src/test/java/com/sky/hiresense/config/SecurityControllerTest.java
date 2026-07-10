package com.sky.hiresense.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sky.hiresense.auth.JwtAuthFilter;
import com.sky.hiresense.auth.JwtUtil;
import com.sky.hiresense.job.EmploymentType;
import com.sky.hiresense.job.JobController;
import com.sky.hiresense.job.JobService;
import com.sky.hiresense.job.dto.CreateJobRequest;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.MeController;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {JobController.class, MeController.class})
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000"
})
class SecurityControllerTest {

    @MockBean
    private JobService jobService;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    private User candidate;
    private User employer;

    @Autowired
    SecurityControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, JwtUtil jwtUtil) {
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
    void jobListIsPublic() throws Exception {
        when(jobService.listJobs(eq(null), eq(null), eq(null), any()))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk());
    }

    @Test
    void jobDetailIsPublic() throws Exception {
        when(jobService.getJob(10L)).thenReturn(jobResponse());

        mockMvc.perform(get("/api/jobs/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.title").value("Backend Developer"));
    }

    @Test
    void protectedEndpointRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    void protectedEndpointRejectsInvalidToken() throws Exception {
        mockMvc.perform(get("/api/me")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateCannotCreateJob() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));

        mockMvc.perform(post("/api/jobs")
                        .header("Authorization", bearer(candidate))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createJobRequest())))
                .andExpect(status().isForbidden());

        verify(jobService, never()).createJob(any(), any());
    }

    @Test
    void employerCanCreateJob() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));
        when(jobService.createJob(any(CreateJobRequest.class), eq(employer))).thenReturn(jobResponse());

        mockMvc.perform(post("/api/jobs")
                        .header("Authorization", bearer(employer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createJobRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.title").value("Backend Developer"));
    }

    private String bearer(User user) {
        return "Bearer " + jwtUtil.generateToken(user);
    }

    private CreateJobRequest createJobRequest() {
        CreateJobRequest request = new CreateJobRequest();
        request.setTitle("Backend Developer");
        request.setDescription("Build APIs with Spring Boot");
        request.setLocation("Remote");
        request.setExperience("2 years");
        request.setType(EmploymentType.FULL_TIME);
        request.setSalaryMin(800000);
        request.setSalaryMax(1200000);
        request.setSkills(Set.of("Java", "Spring Boot"));
        return request;
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
