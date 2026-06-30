package com.sky.hiresense.ai;

import com.sky.hiresense.admin.AdminService;
import com.sky.hiresense.admin.dto.AdminStatsResponse;
import com.sky.hiresense.application.ApplicationService;
import com.sky.hiresense.application.dto.ApplicationResponse;
import com.sky.hiresense.job.JobService;
import com.sky.hiresense.job.dto.JobResponse;
import com.sky.hiresense.user.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

// the tools each role can use; every tool goes through the existing service layer, so RBAC and ownership still apply
@Component
public class ChatTools {

    private final MatchService matchService;
    private final ApplicationService applicationService;
    private final JobService jobService;
    private final AdminService adminService;

    public ChatTools(MatchService matchService, ApplicationService applicationService,
                     JobService jobService, AdminService adminService) {
        this.matchService = matchService;
        this.applicationService = applicationService;
        this.jobService = jobService;
        this.adminService = adminService;
    }

    public List<ChatTool> forUser(User user) {
        return switch (user.getRole()) {
            case CANDIDATE -> List.of(
                    ChatTool.noArg("recommended_jobs",
                            "Jobs recommended for this candidate, ranked by AI fit.",
                            () -> jobsText(matchService.jobsForCandidate(user))),
                    ChatTool.noArg("my_applications",
                            "This candidate's job applications and their current stage.",
                            () -> applicationsText(applicationService.myApplications(user)))
            );
            case EMPLOYER -> List.of(
                    ChatTool.noArg("my_jobs",
                            "Jobs this employer has posted.",
                            () -> jobsText(jobService.myJobs(user)))
            );
            case ADMIN -> List.of(
                    ChatTool.noArg("platform_stats",
                            "Platform-wide counts of users, jobs and applications.",
                            () -> statsText(adminService.stats()))
            );
        };
    }

    private String jobsText(List<JobResponse> jobs) {
        if (jobs.isEmpty()) return "No jobs found.";
        return jobs.stream()
                .map(j -> "- " + j.getTitle() + " at " + j.getCompany())
                .collect(Collectors.joining("\n"));
    }

    private String applicationsText(List<ApplicationResponse> apps) {
        if (apps.isEmpty()) return "No applications yet.";
        return apps.stream()
                .map(a -> "- " + a.getJobTitle() + ": " + a.getStatus())
                .collect(Collectors.joining("\n"));
    }

    private String statsText(AdminStatsResponse s) {
        return "Users: " + s.getTotalUsers() + " (candidates " + s.getCandidates()
                + ", employers " + s.getEmployers() + "), Jobs: " + s.getTotalJobs()
                + ", Applications: " + s.getTotalApplications();
    }
}
