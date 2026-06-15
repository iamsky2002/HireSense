package com.sky.hiresense.skill;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

// shared skill logic, used by jobs and candidate profiles
@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    // turn skill names into Skill entities; reuse if it exists, else create (get-or-create)
    public Set<Skill> resolveSkills(Set<String> names) {
        Set<Skill> skills = new HashSet<>();
        if (names == null) return skills;
        for (String raw : names) {
            if (raw == null || raw.isBlank()) continue;
            String name = raw.trim();
            Skill skill = skillRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> skillRepository.save(Skill.builder().name(name).build()));
            skills.add(skill);
        }
        return skills;
    }
}
