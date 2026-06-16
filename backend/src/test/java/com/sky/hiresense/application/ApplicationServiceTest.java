package com.sky.hiresense.application;

import com.sky.hiresense.job.Job;
import com.sky.hiresense.job.JobRepository;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock private ApplicationRepository applicationRepository;
    @Mock private JobRepository jobRepository;

    @InjectMocks private ApplicationService applicationService;

    private User candidate(Long id) {
        return User.builder().id(id).email("cand" + id + "@hiresense.com").role(Role.CANDIDATE).build();
    }

    @Test
    void apply_whenAlreadyApplied_throwsConflict() {
        Job job = Job.builder().id(5L).title("Java Developer").build();
        when(jobRepository.findById(5L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobIdAndCandidateId(5L, 1L)).thenReturn(true);

        assertThatThrownBy(() -> applicationService.apply(5L, candidate(1L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("already applied");
    }

    @Test
    void apply_whenJobMissing_throwsNotFound() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.apply(99L, candidate(1L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Job not found");
    }
}
