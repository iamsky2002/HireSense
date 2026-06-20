package com.sky.hiresense.admin;

import com.sky.hiresense.admin.dto.AdminStatsResponse;
import com.sky.hiresense.admin.dto.AdminUserResponse;
import com.sky.hiresense.application.ApplicationRepository;
import com.sky.hiresense.job.JobRepository;
import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import com.sky.hiresense.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Platform admin: stats + user management
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminService(UserRepository userRepository, JobRepository jobRepository,
                        ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse stats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .candidates(userRepository.countByRole(Role.CANDIDATE))
                .employers(userRepository.countByRole(Role.EMPLOYER))
                .admins(userRepository.countByRole(Role.ADMIN))
                .totalJobs(jobRepository.count())
                .totalApplications(applicationRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> listUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public AdminUserResponse setEnabled(Long userId, boolean enabled, User admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        // an admin can't lock themselves out
        if (user.getId().equals(admin.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can't change your own account");
        }
        user.setEnabled(enabled);
        return toResponse(userRepository.save(user));
    }

    private AdminUserResponse toResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
