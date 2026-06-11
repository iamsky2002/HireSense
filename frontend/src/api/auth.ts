import api from "./client";

export type Role = "CANDIDATE" | "EMPLOYER" | "ADMIN";

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: Role;
}

export interface AuthResponse extends AuthUser {
  token: string | null;
}

export const registerApi = (data: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data);

export const loginApi = (data: { email: string; password: string }) =>
  api.post<AuthResponse>("/auth/login", data).then((r) => r.data);

export const getMe = () => api.get<AuthUser>("/me").then((r) => r.data);
