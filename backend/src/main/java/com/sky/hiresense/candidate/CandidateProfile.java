package com.sky.hiresense.candidate;

import com.sky.hiresense.skill.Skill;
import com.sky.hiresense.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

// Extra candidate details, one-to-one with User.
// @MapsId matlab iski PK aur user ki PK same hoti hai (user_id hi PK aur FK dono)
@Entity
@Table(name = "candidate_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_candidate_profile_user"))
    private User user;

    private String headline;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "expected_ctc", length = 50)
    private String expectedCtc;

    @Column(name = "resume_url", length = 512)
    private String resumeUrl;

    // resume text, for AI job matching later
    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    // candidate skills, via candidate_skills join table
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "candidate_skills",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"),
            foreignKey = @ForeignKey(name = "fk_candidate_skills_candidate"),
            inverseForeignKey = @ForeignKey(name = "fk_candidate_skills_skill"))
    private Set<Skill> skills = new HashSet<>();
}
