package com.sky.hiresense.savedjob;

import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Saved (bookmarked) jobs, candidate only
@RestController
@RequestMapping("/api")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @PostMapping("/jobs/{id}/save")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Void> save(@PathVariable Long id, @AuthenticationPrincipal User candidate) {
        savedJobService.save(id, candidate);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/jobs/{id}/save")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Void> unsave(@PathVariable Long id, @AuthenticationPrincipal User candidate) {
        savedJobService.unsave(id, candidate);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/saved-jobs")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<JobResponse> savedJobs(@AuthenticationPrincipal User candidate) {
        return savedJobService.listSaved(candidate);
    }
}
