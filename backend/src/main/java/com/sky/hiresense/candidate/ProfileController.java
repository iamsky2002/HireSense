package com.sky.hiresense.candidate;

import com.sky.hiresense.candidate.dto.ProfileResponse;
import com.sky.hiresense.candidate.dto.UpdateProfileRequest;
import com.sky.hiresense.user.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// a candidate's own profile + resume (CANDIDATE only)
@RestController
@RequestMapping("/api/me")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ProfileResponse getProfile(@AuthenticationPrincipal User candidate) {
        return profileService.getMyProfile(candidate);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ProfileResponse updateProfile(@RequestBody UpdateProfileRequest req,
                                         @AuthenticationPrincipal User candidate) {
        return profileService.updateProfile(candidate, req);
    }

    @PostMapping("/resume")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ProfileResponse uploadResume(@RequestParam("file") MultipartFile file,
                                        @AuthenticationPrincipal User candidate) {
        return profileService.uploadResume(candidate, file);
    }
}
