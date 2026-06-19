import api from "./client";
import { EmploymentType } from "./jobs";

// mirrors the backend ApplicationStatus enum
export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "ASSESSMENT"
  | "INTERVIEW"
  | "OFFERED"
  | "HIRED"
  | "REJECTED";

// happy-path order of the hiring pipeline; REJECTED is a separate terminal state
export const STATUS_FLOW: ApplicationStatus[] = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
];

export const statusLabel: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "In Review",
  SHORTLISTED: "Shortlisted",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

// shape of ApplicationResponse from the backend
export interface ApplicationResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string | null;
  type: EmploymentType | null;
  status: ApplicationStatus;
  rejectionReason: string | null;
  rejectedFromStage: ApplicationStatus | null;
  appliedAt: string;
}

// applicant info shown to the employer (candidate name/email + status)
export interface ApplicantResponse {
  applicationId: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  rejectionReason: string | null;
  rejectedFromStage: ApplicationStatus | null;
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

// employer updates an application's status (reason only for REJECTED)
export const updateApplicationStatus = (
  applicationId: number,
  status: ApplicationStatus,
  reason?: string
) =>
  api
    .patch<ApplicationResponse>(`/applications/${applicationId}/status`, { status, reason })
    .then((r) => r.data);
