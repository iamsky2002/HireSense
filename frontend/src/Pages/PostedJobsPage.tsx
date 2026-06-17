import { useState, useEffect } from "react";
import { Button, Select } from "@mantine/core";
import { IconClockHour3, IconMapPin, IconUsers } from "@tabler/icons-react";
import { getMyJobs, JobResponse } from "../api/jobs";
import {
  getApplicants,
  updateApplicationStatus,
  ApplicantResponse,
  ApplicationStatus,
} from "../api/applications";
import { jobTypeLabel, daysAgo } from "../FindJobs/jobMappers";

const statusOptions = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

// one posted job card; expand to see applicants and change their status
const PostedJobCard = ({ job }: { job: JobResponse }) => {
  const [open, setOpen] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantResponse[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const toggle = async () => {
    // pehli baar khulne par hi applicants fetch karo (lazy load)
    if (!loadedOnce) {
      setLoadingApps(true);
      try {
        setApplicants(await getApplicants(job.id));
        setLoadedOnce(true);
      } catch {
        // on error just leave the list empty
      } finally {
        setLoadingApps(false);
      }
    }
    setOpen((o) => !o);
  };

  const changeStatus = async (applicationId: number, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, status);
      // local state turant update kar do (optimistic update)
      setApplicants((apps) =>
        apps.map((a) => (a.applicationId === applicationId ? { ...a, status } : a))
      );
    } catch {
      // if the status update fails, just ignore it
    }
  };

  return (
    <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl p-4 w-full flex flex-col gap-3">
      <div className="font-semibold text-mine-shaft-100">{job.title}</div>
      <div className="flex flex-wrap gap-4 text-xs text-mine-shaft-400">
        {job.location && (
          <span className="flex items-center gap-1">
            <IconMapPin size={14} /> {job.location}
          </span>
        )}
        {job.type && (
          <span className="flex items-center gap-1">
            <IconUsers size={14} /> {jobTypeLabel(job.type)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <IconClockHour3 size={14} /> {daysAgo(job.postedAt)}d ago
        </span>
      </div>

      <Button size="xs" color="brightSun.4" variant="light" className="w-fit" onClick={toggle}>
        {open ? "Hide Applicants" : "View Applicants"}
      </Button>

      {open && (
        <div className="mt-2 flex flex-col gap-2 border-t border-mine-shaft-800 pt-3">
          {loadingApps && <div className="text-mine-shaft-400 text-sm">Loading applicants...</div>}
          {!loadingApps && applicants.length === 0 && (
            <div className="text-mine-shaft-400 text-sm">No applicants yet.</div>
          )}
          {applicants.map((a) => (
            <div
              key={a.applicationId}
              className="flex flex-wrap items-center justify-between gap-3 bg-mine-shaft-800 rounded-lg px-3 py-2"
            >
              <div>
                <div className="text-mine-shaft-100 text-sm font-medium">{a.candidateName}</div>
                <div className="text-mine-shaft-400 text-xs">
                  {a.candidateEmail} • applied {daysAgo(a.appliedAt)}d ago
                </div>
              </div>
              <Select
                size="xs"
                data={statusOptions}
                value={a.status}
                onChange={(val) => val && changeStatus(a.applicationId, val as ApplicationStatus)}
                allowDeselect={false}
                className="w-40"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostedJobsPage = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getMyJobs()
      .then((data) => active && setJobs(data))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-[90vh]">
      <div className="text-2xl font-semibold text-mine-shaft-100 mb-5">Posted Jobs</div>

      {loading && <div className="text-mine-shaft-300">Loading your jobs...</div>}
      {error && <div className="text-red-400">Couldn't load jobs.</div>}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-mine-shaft-400">You haven't posted any jobs yet.</div>
      )}

      <div className="flex flex-col gap-5 max-w-3xl">
        {jobs.map((job) => (
          <PostedJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default PostedJobsPage;
