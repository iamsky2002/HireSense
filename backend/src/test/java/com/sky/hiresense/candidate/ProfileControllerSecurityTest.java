package com.sky.hiresense.candidate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sky.hiresense.auth.JwtAuthFilter;
import com.sky.hiresense.auth.JwtUtil;
import com.sky.hiresense.candidate.dto.ProfileResponse;
import com.sky.hiresense.candidate.dto.UpdateProfileRequest;
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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProfileController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-test-secret-key-123456",
        "app.jwt.expiration-ms=3600000"
})
class ProfileControllerSecurityTest {

    @MockBean
    private ProfileService profileService;

    @MockBean
    private UserRepository userRepository;

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    private User candidate;
    private User employer;

    @Autowired
    ProfileControllerSecurityTest(MockMvc mockMvc, ObjectMapper objectMapper, JwtUtil jwtUtil) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.jwtUtil = jwtUtil;
    }

    @BeforeEach
    void setUp() {
        candidate = user(1L, "candidate@test.com", "Candidate User", Role.CANDIDATE);
        employer = user(2L, "employer@test.com", "Employer User", Role.EMPLOYER);
    }

    @Test
    void getProfileRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/me/profile"))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateCanGetProfile() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(profileService.getMyProfile(candidate)).thenReturn(profileResponse());

        mockMvc.perform(get("/api/me/profile")
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1L))
                .andExpect(jsonPath("$.headline").value("Java Backend Developer"));
    }

    @Test
    void employerCannotGetProfile() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(get("/api/me/profile")
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(profileService, never()).getMyProfile(any());
    }

    @Test
    void candidateCanUpdateProfile() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(profileService.updateProfile(any(), any())).thenReturn(profileResponse());

        mockMvc.perform(put("/api/me/profile")
                        .header("Authorization", bearer(candidate))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateProfileRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills.length()").value(2));
    }

    @Test
    void employerCannotUpdateProfile() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(put("/api/me/profile")
                        .header("Authorization", bearer(employer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateProfileRequest())))
                .andExpect(status().isForbidden());

        verify(profileService, never()).updateProfile(any(), any());
    }

    @Test
    void candidateCanUploadResume() throws Exception {
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(profileService.uploadResume(any(), any())).thenReturn(profileWithResume());

        mockMvc.perform(multipart("/api/me/resume")
                        .file(resumeFile())
                        .header("Authorization", bearer(candidate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resumeUrl").value("uploads/resumes/resume_1.pdf"));
    }

    @Test
    void employerCannotUploadResume() throws Exception {
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        mockMvc.perform(multipart("/api/me/resume")
                        .file(resumeFile())
                        .header("Authorization", bearer(employer)))
                .andExpect(status().isForbidden());

        verify(profileService, never()).uploadResume(any(), any());
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

    private UpdateProfileRequest updateProfileRequest() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setHeadline("Java Backend Developer");
        request.setExperienceYears(2);
        request.setExpectedCtc("12 LPA");
        request.setSkills(Set.of("Java", "Spring Boot"));
        return request;
    }

    private ProfileResponse profileResponse() {
        return ProfileResponse.builder()
                .userId(1L)
                .fullName("Candidate User")
                .email("candidate@test.com")
                .headline("Java Backend Developer")
                .experienceYears(2)
                .expectedCtc("12 LPA")
                .skills(Set.of("Java", "Spring Boot"))
                .build();
    }

    private ProfileResponse profileWithResume() {
        return ProfileResponse.builder()
                .userId(1L)
                .fullName("Candidate User")
                .email("candidate@test.com")
                .headline("Java Backend Developer")
                .experienceYears(2)
                .expectedCtc("12 LPA")
                .resumeUrl("uploads/resumes/resume_1.pdf")
                .skills(Set.of("Java", "Spring Boot"))
                .build();
    }

    private MockMultipartFile resumeFile() {
        return new MockMultipartFile("file", "resume.pdf", "application/pdf", "pdf".getBytes());
    }
}
