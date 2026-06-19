import { useEffect, useState } from "react";
import { getMyJobs, JobResponse } from "../api/jobs";
import { getApplicants, ApplicantResponse, ApplicationStatus } from "../api/applications";

// loads the employer's jobs + each job's applicants; used by Dashboard and PostedJobs
export function useEmployerApplicants() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [appsByJob, setAppsByJob] = useState<Record<number, ApplicantResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getMyJobs()
      .then(async (myJobs) => {
        // fetch each job's applicants in parallel; empty on failure
        const lists = await Promise.all(
          myJobs.map((j) => getApplicants(j.id).catch(() => [] as ApplicantResponse[]))
        );
        if (!active) return;
        const map: Record<number, ApplicantResponse[]> = {};
        myJobs.forEach((j, i) => {
          map[j.id] = lists[i];
        });
        setJobs(myJobs);
        setAppsByJob(map);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const setStatus = (jobId: number, applicationId: number, status: ApplicationStatus) => {
    setAppsByJob((prev) => ({
      ...prev,
      [jobId]: prev[jobId].map((a) =>
        a.applicationId === applicationId ? { ...a, status } : a
      ),
    }));
  };

  return { jobs, appsByJob, loading, error, setStatus };
}
