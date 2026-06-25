package com.sky.hiresense.ai;

import com.sky.hiresense.candidate.CandidateProfile;
import com.sky.hiresense.job.Job;
import com.sky.hiresense.skill.Skill;

import java.util.stream.Collectors;

// builds the text we feed to the embedding model for a job or a candidate
final class EmbeddingText {

    private EmbeddingText() {
    }

    static String forJob(Job job) {
        String skills = job.getSkills().stream().map(Skill::getName).collect(Collectors.joining(", "));
        return join(job.getTitle(), job.getExperience(), skills, job.getDescription());
    }

    static String forCandidate(CandidateProfile p) {
        String skills = p.getSkills().stream().map(Skill::getName).collect(Collectors.joining(", "));
        String years = p.getExperienceYears() == null ? null : p.getExperienceYears() + " years";
        return join(p.getHeadline(), years, skills, p.getResumeText());
    }

    private static String join(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (part != null && !part.isBlank()) {
                sb.append(part).append('\n');
            }
        }
        return sb.toString().strip();
    }
}
