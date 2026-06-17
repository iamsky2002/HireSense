import api from "./client";
import { EmploymentType } from "./jobs";

// mirrors the backend ApplicationStatus enum
export type ApplicationStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "HIRED";

// shape of ApplicationResponse from the backend
export interface ApplicationResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string | null;
  type: EmploymentType | null;
  status: ApplicationStatus;
  appliedAt: string;
}

// applicant info shown to the employer (candidate name/email + status)
export interface ApplicantResponse {
  applicationId: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  appliedAt: string;
}

// candidate applies to a job (token added by the interceptor)
export const applyToJob = (jobId: number) =>
  api.post<ApplicationResponse>(`/jobs/${jobId}/apply`).then((r) => r.data);

// the logged-in candidate's applications
export const getMyApplications = () =>
  api.get<ApplicationResponse[]>("/applications/me").then((r) => r.data);

// applicants for one of the employer's jobs
export const getApplicants = (jobId: number) =>
  api.get<ApplicantResponse[]>(`/jobs/${jobId}/applicants`).then((r) => r.data);

// employer updates an application's status
export const updateApplicationStatus = (applicationId: number, status: ApplicationStatus) =>
  api.patch<ApplicationResponse>(`/applications/${applicationId}/status`, { status }).then((r) => r.data);
