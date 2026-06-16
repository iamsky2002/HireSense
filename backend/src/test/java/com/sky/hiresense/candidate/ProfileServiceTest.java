package com.sky.hiresense.candidate;

import com.sky.hiresense.skill.SkillService;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock private CandidateProfileRepository profileRepository;
    @Mock private UserRepository userRepository;
    @Mock private SkillService skillService;

    @InjectMocks private ProfileService profileService;

    private final User candidate = User.builder()
            .id(1L).email("cand@hiresense.com").role(Role.CANDIDATE).build();

    @Test
    void uploadResume_nonPdf_throwsBadRequest() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getContentType()).thenReturn("image/png");

        assertThatThrownBy(() -> profileService.uploadResume(candidate, file))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Only PDF");
    }

    @Test
    void uploadResume_emptyFile_throwsBadRequest() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(true);

        assertThatThrownBy(() -> profileService.uploadResume(candidate, file))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("empty");
    }
}
