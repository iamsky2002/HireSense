import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { JobResponse } from "../api/jobs";
import { getSavedJobs, saveJob, unsaveJob } from "../api/savedJobs";

interface SavedJobsContextType {
  savedJobs: JobResponse[];
  isSaved: (jobId: number) => boolean;
  toggleSave: (jobId: number) => void;
  canSave: boolean; // only a candidate can save
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<JobResponse[]>([]);
  const canSave = user?.role === "CANDIDATE";

  const refresh = () => getSavedJobs().then(setSavedJobs).catch(() => {});

  // load the saved list on candidate login; clear it on logout
  useEffect(() => {
    if (canSave) refresh();
    else setSavedJobs([]);
  }, [canSave]);

  const savedIds = useMemo(() => new Set(savedJobs.map((j) => j.id)), [savedJobs]);
  const isSaved = (jobId: number) => savedIds.has(jobId);

  const toggleSave = async (jobId: number) => {
    if (!canSave) return;
    try {
      if (savedIds.has(jobId)) {
        // optimistic remove (instant icon feedback)
        setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
        await unsaveJob(jobId);
      } else {
        await saveJob(jobId);
        await refresh(); // refetch to get the full job object
      }
    } catch {
      refresh(); // on failure, resync from the server
    }
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, isSaved, toggleSave, canSave }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) throw new Error("useSavedJobs must be used within SavedJobsProvider");
  return ctx;
};
