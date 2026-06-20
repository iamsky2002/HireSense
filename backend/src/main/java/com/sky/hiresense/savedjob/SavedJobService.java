package com.sky.hiresense.savedjob;

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

// Save / unsave / list a candidate's bookmarked jobs
@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;

    public SavedJobService(SavedJobRepository savedJobRepository, JobRepository jobRepository, JobService jobService) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
    }

    @Transactional
    public void save(Long jobId, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        // idempotent: saving twice is a no-op (unique constraint backs this up anyway)
        if (savedJobRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            return;
        }
        savedJobRepository.save(SavedJob.builder().job(job).candidate(candidate).build());
    }

    @Transactional
    public void unsave(Long jobId, User candidate) {
        savedJobRepository.deleteByJobIdAndCandidateId(jobId, candidate.getId());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> listSaved(User candidate) {
        return savedJobRepository.findByCandidateIdOrderBySavedAtDesc(candidate.getId())
                .stream()
                .map(saved -> jobService.toResponse(saved.getJob()))
                .toList();
    }
}
