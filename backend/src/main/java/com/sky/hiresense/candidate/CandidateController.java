package com.sky.hiresense.candidate;

import com.sky.hiresense.candidate.dto.CandidateSummaryResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Find Talent: employers browse candidates (EMPLOYER only)
@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final ProfileService profileService;

    public CandidateController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<CandidateSummaryResponse> list() {
        return profileService.listCandidates();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public CandidateSummaryResponse get(@PathVariable Long id) {
        return profileService.getCandidate(id);
    }
}
