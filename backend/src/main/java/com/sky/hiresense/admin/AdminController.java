package com.sky.hiresense.admin;

import com.sky.hiresense.admin.dto.AdminStatsResponse;
import com.sky.hiresense.admin.dto.AdminUserResponse;
import com.sky.hiresense.user.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Admin-only platform management
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats() {
        return adminService.stats();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> users() {
        return adminService.listUsers();
    }

    @PatchMapping("/users/{id}/enabled")
    public AdminUserResponse setEnabled(@PathVariable Long id,
                                        @RequestParam boolean enabled,
                                        @AuthenticationPrincipal User admin) {
        return adminService.setEnabled(id, enabled, admin);
    }
}
