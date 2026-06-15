package com.sky.hiresense.job;

import com.sky.hiresense.job.dto.CreateJobRequest;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Job endpoints: search, detail, create, update, delete
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // public job search with optional filters + pagination
    // e.g. ?title=dev&location=Remote&type=FULL_TIME&page=0&size=10
    @GetMapping
    public Page<JobResponse> listJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType type,
            Pageable pageable) {
        return jobService.listJobs(title, location, type, pageable);
    }

    // /mine ko /{id} se upar rakha hai, warna spring "mine" ko id samajh leta hai
    @GetMapping("/mine")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<JobResponse> myJobs(@AuthenticationPrincipal User employer) {
        return jobService.myJobs(employer);
    }

    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable Long id) {
        return jobService.getJob(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody CreateJobRequest req,
                                                 @AuthenticationPrincipal User employer) {
        JobResponse created = jobService.createJob(req, employer);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ownership check happens in JobService
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobResponse updateJob(@PathVariable Long id,
                                 @Valid @RequestBody CreateJobRequest req,
                                 @AuthenticationPrincipal User employer) {
        return jobService.updateJob(id, req, employer);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id,
                                          @AuthenticationPrincipal User employer) {
        jobService.deleteJob(id, employer);
        return ResponseEntity.noContent().build();
    }
}
