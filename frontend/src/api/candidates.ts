import api from "./client";

// shape of CandidateSummaryResponse (for Find Talent; no private data like email)
export interface CandidateSummaryResponse {
  userId: number;
  fullName: string;
  headline: string | null;
  experienceYears: number | null;
  expectedCtc: string | null;
  skills: string[];
}

// all candidates (EMPLOYER only; token added by the interceptor)
export const getCandidates = () =>
  api.get<CandidateSummaryResponse[]>("/candidates").then((r) => r.data);

// single candidate detail
export const getCandidate = (id: number) =>
  api.get<CandidateSummaryResponse>(`/candidates/${id}`).then((r) => r.data);
