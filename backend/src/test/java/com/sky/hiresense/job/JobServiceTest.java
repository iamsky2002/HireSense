package com.sky.hiresense.job;

import com.sky.hiresense.company.Company;
import com.sky.hiresense.company.CompanyRepository;
import com.sky.hiresense.job.dto.CreateJobRequest;
import com.sky.hiresense.skill.SkillService;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock private JobRepository jobRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private SkillService skillService;

    @InjectMocks private JobService jobService;

    private User employer(Long id) {
        return User.builder().id(id).email("emp" + id + "@hiresense.com").role(Role.EMPLOYER).build();
    }

    // a job that belongs to the employer with the given id
    private Job jobOwnedBy(Long ownerId) {
        Company company = Company.builder().id(10L).name("Acme").owner(employer(ownerId)).build();
        return Job.builder().id(5L).title("Java Developer").company(company).build();
    }

    @Test
    void updateJob_byDifferentEmployer_throwsForbidden() {
        when(jobRepository.findById(5L)).thenReturn(Optional.of(jobOwnedBy(1L)));

        // employer 2 tries to edit employer 1's job
        assertThatThrownBy(() -> jobService.updateJob(5L, new CreateJobRequest(), employer(2L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("your own jobs");
    }

    @Test
    void deleteJob_byDifferentEmployer_throwsForbidden() {
        when(jobRepository.findById(5L)).thenReturn(Optional.of(jobOwnedBy(1L)));

        assertThatThrownBy(() -> jobService.deleteJob(5L, employer(2L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("your own jobs");
    }

    @Test
    void getJob_whenMissing_throwsNotFound() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.getJob(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Job not found");
    }
}
