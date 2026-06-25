package com.sky.hiresense.ai;

import com.sky.hiresense.candidate.CandidateProfile;
import com.sky.hiresense.candidate.CandidateProfileRepository;
import com.sky.hiresense.candidate.ProfileService;
import com.sky.hiresense.company.Company;
import com.sky.hiresense.job.Job;
import com.sky.hiresense.job.JobRepository;
import com.sky.hiresense.job.JobService;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchServiceTest {

    @Mock private GeminiEmbeddingClient gemini;
    @Mock private QdrantClient qdrant;
    @Mock private JobRepository jobRepository;
    @Mock private JobService jobService;
    @Mock private CandidateProfileRepository profileRepository;
    @Mock private ProfileService profileService;

    @InjectMocks private MatchService matchService;

    private User candidate(Long id) {
        return User.builder().id(id).email("cand" + id + "@hiresense.com").role(Role.CANDIDATE).build();
    }

    @Test
    void jobsForCandidate_whenAiDisabled_returnsEmpty() {
        when(gemini.isEnabled()).thenReturn(false);

        assertThat(matchService.jobsForCandidate(candidate(1L))).isEmpty();
    }

    @Test
    void jobsForCandidate_keepsQdrantOrderAndSkipsMissingIds() {
        when(gemini.isEnabled()).thenReturn(true);
        when(profileRepository.findById(1L)).thenReturn(Optional.of(CandidateProfile.builder().userId(1L).build()));
        when(gemini.embed(anyString())).thenReturn(new float[]{0.1f, 0.2f});
        // qdrant ranks 3 above 1, and 99 no longer exists in the db
        when(qdrant.search(eq(AiIndexService.JOBS), any(), anyInt())).thenReturn(List.of(3L, 1L, 99L));

        Job job1 = Job.builder().id(1L).build();
        Job job3 = Job.builder().id(3L).build();
        when(jobRepository.findAllById(List.of(3L, 1L, 99L))).thenReturn(List.of(job1, job3));

        JobResponse resp1 = JobResponse.builder().id(1L).build();
        JobResponse resp3 = JobResponse.builder().id(3L).build();
        when(jobService.toResponse(job1)).thenReturn(resp1);
        when(jobService.toResponse(job3)).thenReturn(resp3);

        List<JobResponse> result = matchService.jobsForCandidate(candidate(1L));

        assertThat(result).containsExactly(resp3, resp1);
    }

    @Test
    void candidatesForJob_whenNotOwner_throwsForbidden() {
        Company othersCompany = Company.builder().owner(candidate(2L)).build();
        Job job = Job.builder().id(7L).company(othersCompany).build();
        when(gemini.isEnabled()).thenReturn(true);
        when(jobRepository.findById(7L)).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> matchService.candidatesForJob(7L, candidate(1L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("your own jobs");
    }
}
