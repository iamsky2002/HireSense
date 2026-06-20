import api from "./client";

// mirrors the backend EmploymentType enum
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY";

// shape of JobResponse from the backend (GET)
export interface JobResponse {
  id: number;
  title: string;
  description: string;
  location: string | null;
  experience: string | null;
  type: EmploymentType | null;
  salaryMin: number | null;
  salaryMax: number | null;
  postedAt: string;
  company: string;       // just the company name
  skills: string[];      // skill names only
}

// Spring Data Page<T> shape, used for pagination
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;        // current page index (0-based)
  size: number;
}

// sent to the backend when creating/updating a job (matches CreateJobRequest)
export interface CreateJobRequest {
  title: string;
  description: string;
  location?: string;
  experience?: string;
  type: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
}

// search filters for the Find Jobs page (set by SearchBar)
export interface JobFilters {
  title: string;
  location: string;
  type: EmploymentType | "";
}

// job search with optional filters + pagination (public, no token needed)
export const searchJobs = (params: {
  title?: string;
  location?: string;
  type?: EmploymentType;
  page?: number;
  size?: number;
  sort?: string;
}) => api.get<Page<JobResponse>>("/jobs", { params }).then((r) => r.data);

// single job detail (public)
export const getJob = (id: number) =>
  api.get<JobResponse>(`/jobs/${id}`).then((r) => r.data);

// post a new job (EMPLOYER only; token added by the interceptor)
export const createJob = (data: CreateJobRequest) =>
  api.post<JobResponse>("/jobs", data).then((r) => r.data);

// edit an existing job (EMPLOYER + owner only)
export const updateJob = (id: number, data: CreateJobRequest) =>
  api.put<JobResponse>(`/jobs/${id}`, data).then((r) => r.data);

// the logged-in employer's own posted jobs
export const getMyJobs = () =>
  api.get<JobResponse[]>("/jobs/mine").then((r) => r.data);
