package com.sky.hiresense.job;

import com.sky.hiresense.company.Company;
import com.sky.hiresense.company.CompanyRepository;
import com.sky.hiresense.job.dto.CreateJobRequest;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.skill.Skill;
import com.sky.hiresense.skill.SkillService;
import com.sky.hiresense.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

// Job business logic + ownership checks
@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final SkillService skillService;

    public JobService(JobRepository jobRepository,
                      CompanyRepository companyRepository,
                      SkillService skillService) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.skillService = skillService;
    }

    // readOnly since it only reads
    @Transactional(readOnly = true)
    public Page<JobResponse> listJobs(String title, String location, EmploymentType type, Pageable pageable) {
        return jobRepository.search(title, location, type, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public JobResponse getJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        return toResponse(job);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> myJobs(User employer) {
        return jobRepository.findByCompanyOwnerIdOrderByPostedAtDesc(employer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JobResponse createJob(CreateJobRequest req, User employer) {
        Company company = getOrCreateCompany(employer);
        Job job = Job.builder()
                .company(company)
                .title(req.getTitle())
                .description(req.getDescription())
                .location(req.getLocation())
                .experience(req.getExperience())
                .type(req.getType())
                .salaryMin(req.getSalaryMin())
                .salaryMax(req.getSalaryMax())
                .skills(skillService.resolveSkills(req.getSkills()))
                .build();
        return toResponse(jobRepository.save(job));
    }

    @Transactional
    public JobResponse updateJob(Long id, CreateJobRequest req, User employer) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        ensureOwner(job, employer);

        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setLocation(req.getLocation());
        job.setExperience(req.getExperience());
        job.setType(req.getType());
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        job.setSkills(skillService.resolveSkills(req.getSkills()));
        return toResponse(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(Long id, User employer) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        ensureOwner(job, employer);
        jobRepository.delete(job);
    }

    // sirf EMPLOYER role hona kaafi nahi, job bhi usi ki honi chahiye warna 403
    private void ensureOwner(Job job, User employer) {
        Long ownerId = job.getCompany().getOwner().getId();
        if (!ownerId.equals(employer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own jobs");
        }
    }

    // get the employer's company, or create a default one (proper onboarding flow comes later)
    private Company getOrCreateCompany(User employer) {
        return companyRepository.findByOwnerId(employer.getId())
                .orElseGet(() -> companyRepository.save(
                        Company.builder()
                                .name(employer.getFullName())
                                .owner(employer)
                                .build()));
    }

    // map entity to DTO (only safe, flat fields) — public so SavedJobService can reuse it
    public JobResponse toResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .experience(job.getExperience())
                .type(job.getType())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .postedAt(job.getPostedAt())
                .company(job.getCompany().getName())
                .skills(job.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .build();
    }
}
