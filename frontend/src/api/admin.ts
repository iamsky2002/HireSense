import api from "./client";
import { Role } from "./auth";

export interface AdminStats {
  totalUsers: number;
  candidates: number;
  employers: number;
  admins: number;
  totalJobs: number;
  totalApplications: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export const getAdminStats = () => api.get<AdminStats>("/admin/stats").then((r) => r.data);

export const getAdminUsers = () => api.get<AdminUser[]>("/admin/users").then((r) => r.data);

// enable / disable a user account
export const setUserEnabled = (id: number, enabled: boolean) =>
  api
    .patch<AdminUser>(`/admin/users/${id}/enabled`, null, { params: { enabled } })
    .then((r) => r.data);
