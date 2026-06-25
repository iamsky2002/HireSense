package com.sky.hiresense.candidate;

import com.sky.hiresense.ai.AiIndexService;
import com.sky.hiresense.candidate.dto.CandidateSummaryResponse;
import com.sky.hiresense.candidate.dto.ProfileResponse;
import com.sky.hiresense.candidate.dto.UpdateProfileRequest;
import com.sky.hiresense.skill.Skill;
import com.sky.hiresense.skill.SkillService;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// Candidate profile + resume upload logic
@Service
public class ProfileService {

    // stored on local disk for now; move to cloud storage later
    private static final Path RESUME_DIR = Path.of("uploads", "resumes");

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;
    private final AiIndexService aiIndex;

    public ProfileService(CandidateProfileRepository profileRepository,
                          UserRepository userRepository,
                          SkillService skillService,
                          AiIndexService aiIndex) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillService = skillService;
        this.aiIndex = aiIndex;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(User candidate) {
        return profileRepository.findById(candidate.getId())
                .map(profile -> toResponse(profile, candidate))
                .orElseGet(() -> emptyResponse(candidate));
    }

    @Transactional
    public ProfileResponse updateProfile(User candidate, UpdateProfileRequest req) {
        CandidateProfile profile = getOrCreateProfile(candidate);
        profile.setHeadline(req.getHeadline());
        profile.setExperienceYears(req.getExperienceYears());
        profile.setExpectedCtc(req.getExpectedCtc());
        profile.setSkills(skillService.resolveSkills(req.getSkills()));
        CandidateProfile saved = profileRepository.save(profile);
        aiIndex.indexCandidate(saved);
        return toResponse(saved, candidate);
    }

    @Transactional
    public ProfileResponse uploadResume(User candidate, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resume file is empty");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF resumes are allowed");
        }

        String filename = "resume_" + candidate.getId() + "_" + System.currentTimeMillis() + ".pdf";
        try {
            Files.createDirectories(RESUME_DIR);
            Files.copy(file.getInputStream(), RESUME_DIR.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save resume");
        }

        CandidateProfile profile = getOrCreateProfile(candidate);
        // forward slashes so the path works across OSes
        profile.setResumeUrl(RESUME_DIR.resolve(filename).toString().replace("\\", "/"));
        return toResponse(profileRepository.save(profile), candidate);
    }

    @Transactional(readOnly = true)
    public List<CandidateSummaryResponse> listCandidates() {
        return profileRepository.findAll().stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public CandidateSummaryResponse getCandidate(Long userId) {
        CandidateProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found"));
        return toSummary(profile);
    }

    // get existing profile or make a new one; @MapsId ties profile PK to user.id
    private CandidateProfile getOrCreateProfile(User candidate) {
        return profileRepository.findById(candidate.getId())
                .orElseGet(() -> {
                    CandidateProfile p = new CandidateProfile();
                    p.setUser(userRepository.getReferenceById(candidate.getId()));
                    return p;
                });
    }

    private ProfileResponse toResponse(CandidateProfile profile, User user) {
        return ProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .headline(profile.getHeadline())
                .experienceYears(profile.getExperienceYears())
                .expectedCtc(profile.getExpectedCtc())
                .resumeUrl(profile.getResumeUrl())
                .skills(profile.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .build();
    }

    private ProfileResponse emptyResponse(User user) {
        return ProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .skills(Set.of())
                .build();
    }

    // summary for Find Talent, no private data like email; public so MatchService can reuse it
    public CandidateSummaryResponse toSummary(CandidateProfile profile) {
        return CandidateSummaryResponse.builder()
                .userId(profile.getUserId())
                .fullName(profile.getUser().getFullName())
                .headline(profile.getHeadline())
                .experienceYears(profile.getExperienceYears())
                .expectedCtc(profile.getExpectedCtc())
                .skills(profile.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .build();
    }
}
