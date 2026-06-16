package com.sky.hiresense.skill;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

    @Mock private SkillRepository skillRepository;

    @InjectMocks private SkillService skillService;

    @Test
    void resolveSkills_null_returnsEmpty() {
        assertThat(skillService.resolveSkills(null)).isEmpty();
    }

    @Test
    void resolveSkills_existingSkill_isReused_notCreatedAgain() {
        when(skillRepository.findByNameIgnoreCase("Java"))
                .thenReturn(Optional.of(Skill.builder().id(1L).name("Java").build()));

        Set<Skill> result = skillService.resolveSkills(Set.of("Java"));

        assertThat(result).hasSize(1);
        // existing skill found, so we should not save a duplicate
        verify(skillRepository, never()).save(any());
    }
}
