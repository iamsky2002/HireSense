import api from "./client";
import { JobResponse } from "./jobs";
import { CandidateSummaryResponse } from "./candidates";

// AI-matched jobs for the candidate; empty when AI is off or nothing is indexed yet
export const getJobMatches = () =>
  api.get<JobResponse[]>("/matches/jobs").then((r) => r.data);

// AI-matched candidates for one of the employer's own jobs
export const getCandidateMatches = (jobId: number) =>
  api.get<CandidateSummaryResponse[]>(`/matches/jobs/${jobId}/candidates`).then((r) => r.data);
