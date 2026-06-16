package com.sky.hiresense.application;

import com.sky.hiresense.application.dto.ApplicantResponse;
import com.sky.hiresense.application.dto.ApplicationResponse;
import com.sky.hiresense.job.Job;
import com.sky.hiresense.job.JobRepository;
import com.sky.hiresense.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Job application logic
@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public ApplicationResponse apply(Long jobId, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        // friendly duplicate check (DB also has a unique constraint)
        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied to this job");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .build();

        return toResponse(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> myApplications(User candidate) {
        return applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidate.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicantResponse> applicantsForJob(Long jobId, User employer) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        ensureJobOwner(job, employer);
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)
                .stream()
                .map(this::toApplicant)
                .toList();
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatus status, User employer) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        ensureJobOwner(application.getJob(), employer);
        application.setStatus(status);
        return toResponse(applicationRepository.save(application));
    }

    // employer can only touch their own job's applicants
    private void ensureJobOwner(Job job, User employer) {
        if (!job.getCompany().getOwner().getId().equals(employer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own jobs' applicants");
        }
    }

    private ApplicantResponse toApplicant(Application application) {
        User candidate = application.getCandidate();
        return ApplicantResponse.builder()
                .applicationId(application.getId())
                .candidateId(candidate.getId())
                .candidateName(candidate.getFullName())
                .candidateEmail(candidate.getEmail())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }

    private ApplicationResponse toResponse(Application application) {
        Job job = application.getJob();
        return ApplicationResponse.builder()
                .applicationId(application.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .company(job.getCompany().getName())
                .location(job.getLocation())
                .type(job.getType())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
