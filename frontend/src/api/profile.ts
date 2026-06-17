import api from "./client";

// shape of ProfileResponse from the backend
export interface ProfileResponse {
  userId: number;
  fullName: string;
  email: string;
  headline: string | null;
  experienceYears: number | null;
  expectedCtc: string | null;
  resumeUrl: string | null;
  skills: string[];
}

// profile update request (all fields optional)
export interface UpdateProfileRequest {
  headline?: string;
  experienceYears?: number;
  expectedCtc?: string;
  skills?: string[];
}

// the logged-in candidate's own profile
export const getMyProfile = () =>
  api.get<ProfileResponse>("/me/profile").then((r) => r.data);

// Profile update.
export const updateProfile = (data: UpdateProfileRequest) =>
  api.put<ProfileResponse>("/me/profile", data).then((r) => r.data);

// resume (PDF) upload, multipart form-data; axios FormData ke saath content-type khud set kar deta hai
export const uploadResume = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post<ProfileResponse>("/me/resume", form).then((r) => r.data);
};
