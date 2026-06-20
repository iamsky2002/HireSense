import api from "./client";
import { JobResponse } from "./jobs";

// candidate bookmarks a job
export const saveJob = (jobId: number) =>
  api.post(`/jobs/${jobId}/save`).then((r) => r.data);

// candidate removes a bookmark
export const unsaveJob = (jobId: number) =>
  api.delete(`/jobs/${jobId}/save`).then((r) => r.data);

// the candidate's saved jobs (full job data)
export const getSavedJobs = () =>
  api.get<JobResponse[]>("/me/saved-jobs").then((r) => r.data);
