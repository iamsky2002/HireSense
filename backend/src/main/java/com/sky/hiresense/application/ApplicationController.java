package com.sky.hiresense.application;

import com.sky.hiresense.application.dto.ApplicantResponse;
import com.sky.hiresense.application.dto.ApplicationResponse;
import com.sky.hiresense.application.dto.UpdateStatusRequest;
import com.sky.hiresense.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Application endpoints: apply, my applications, applicants, status update
@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // candidate applies; duplicate apply returns 409
    @PostMapping("/jobs/{id}/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable Long id,
                                                     @AuthenticationPrincipal User candidate) {
        ApplicationResponse res = applicationService.apply(id, candidate);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/applications/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<ApplicationResponse> myApplications(@AuthenticationPrincipal User candidate) {
        return applicationService.myApplications(candidate);
    }

    @GetMapping("/jobs/{id}/applicants")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<ApplicantResponse> applicants(@PathVariable Long id,
                                              @AuthenticationPrincipal User employer) {
        return applicationService.applicantsForJob(id, employer);
    }

    @PatchMapping("/applications/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ApplicationResponse updateStatus(@PathVariable Long id,
                                            @Valid @RequestBody UpdateStatusRequest req,
                                            @AuthenticationPrincipal User employer) {
        return applicationService.updateStatus(id, req.getStatus(), req.getReason(), employer);
    }
}
