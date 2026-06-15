package com.sky.hiresense.skill;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    // IgnoreCase so "java" and "Java" count as the same skill
    Optional<Skill> findByNameIgnoreCase(String name);
}
