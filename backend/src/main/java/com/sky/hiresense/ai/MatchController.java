package com.sky.hiresense.ai;

import com.sky.hiresense.candidate.dto.CandidateSummaryResponse;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// AI matching endpoints
@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<JobResponse> myJobMatches(@AuthenticationPrincipal User candidate) {
        return matchService.jobsForCandidate(candidate);
    }

    @GetMapping("/jobs/{jobId}/candidates")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<CandidateSummaryResponse> jobCandidateMatches(@PathVariable Long jobId,
                                                              @AuthenticationPrincipal User employer) {
        return matchService.candidatesForJob(jobId, employer);
    }
}
