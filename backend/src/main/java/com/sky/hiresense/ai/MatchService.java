package com.sky.hiresense.ai;

import com.sky.hiresense.candidate.CandidateProfile;
import com.sky.hiresense.candidate.CandidateProfileRepository;
import com.sky.hiresense.candidate.ProfileService;
import com.sky.hiresense.candidate.dto.CandidateSummaryResponse;
import com.sky.hiresense.job.Job;
import com.sky.hiresense.job.JobRepository;
import com.sky.hiresense.job.JobService;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

// embeds one side and searches the other side in Qdrant to find the best matches
@Service
public class MatchService {

    private static final int LIMIT = 10;

    private final GeminiEmbeddingClient gemini;
    private final QdrantClient qdrant;
    private final JobRepository jobRepository;
    private final JobService jobService;
    private final CandidateProfileRepository profileRepository;
    private final ProfileService profileService;

    public MatchService(GeminiEmbeddingClient gemini, QdrantClient qdrant,
                        JobRepository jobRepository, JobService jobService,
                        CandidateProfileRepository profileRepository, ProfileService profileService) {
        this.gemini = gemini;
        this.qdrant = qdrant;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    @Transactional(readOnly = true)
    public List<JobResponse> jobsForCandidate(User candidate) {
        if (!gemini.isEnabled()) return List.of();
        CandidateProfile profile = profileRepository.findById(candidate.getId()).orElse(null);
        if (profile == null) return List.of();

        float[] vec = gemini.embed(EmbeddingText.forCandidate(profile));
        List<Long> ids = qdrant.search(AiIndexService.JOBS, vec, LIMIT);

        Map<Long, Job> byId = jobRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Job::getId, Function.identity()));
        return ordered(ids, byId, jobService::toResponse);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String query) {
        if (!gemini.isEnabled() || query == null || query.isBlank()) return List.of();

        float[] vec = gemini.embed(query);
        List<Long> ids = qdrant.search(AiIndexService.JOBS, vec, LIMIT);

        Map<Long, Job> byId = jobRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Job::getId, Function.identity()));
        return ordered(ids, byId, jobService::toResponse);
    }

    @Transactional(readOnly = true)
    public List<CandidateSummaryResponse> candidatesForJob(Long jobId, User employer) {
        if (!gemini.isEnabled()) return List.of();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        if (!job.getCompany().getOwner().getId().equals(employer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only match your own jobs");
        }

        float[] vec = gemini.embed(EmbeddingText.forJob(job));
        List<Long> ids = qdrant.search(AiIndexService.CANDIDATES, vec, LIMIT);

        Map<Long, CandidateProfile> byId = profileRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(CandidateProfile::getUserId, Function.identity()));
        return ordered(ids, byId, profileService::toSummary);
    }

    // findAllById loses the order, so re-sort by Qdrant's id list and drop ids the db no longer has
    private <T, R> List<R> ordered(List<Long> ids, Map<Long, T> byId, Function<T, R> map) {
        return ids.stream().map(byId::get).filter(Objects::nonNull).map(map).toList();
    }
}
