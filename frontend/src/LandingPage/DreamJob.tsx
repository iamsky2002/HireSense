import { TextInput, Button } from "@mantine/core";
import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconBolt,
  IconChecklist,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchJobs, JobResponse } from "../api/jobs";
import { jobTypeLabel, daysAgo } from "../FindJobs/jobMappers";

// Hero section: headline + search, with real recent jobs floating on the right.
const DreamJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);

  // pull the latest few jobs straight from the backend (public endpoint, no token needed)
  useEffect(() => {
    let active = true;
    searchJobs({ page: 0, size: 3, sort: "postedAt,desc" })
      .then((d) => {
        if (!active) return;
        setJobs(d.content);
        setTotalJobs(d.totalElements);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = () => {
    const q = title.trim();
    navigate(q ? `/find-jobs?title=${encodeURIComponent(q)}` : "/find-jobs");
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 px-4 sm:px-8 lg:px-16 py-8 lg:py-12">
      {/* left: headline + real stats + search */}
      <div className="flex flex-col w-full lg:w-[48%] gap-4">
        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-mine-shaft-100 [&>span]:text-bright-sun-400">
          Find the <span>right job</span>.
          <br />
          Not just <span>any job</span>.
        </div>
        <div className="text-lg text-mine-shaft-300">
          HireSense matches your skills to real openings. Apply in one click and
          track every step of your application.
        </div>

        {/* honest highlight pills (job count is live from the backend) */}
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-2 bg-mine-shaft-800/60 border border-mine-shaft-700 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-mine-shaft-200">
              <b className="text-bright-sun-400">{totalJobs}</b> live jobs
            </span>
          </div>
          <div className="flex items-center gap-2 bg-mine-shaft-800/60 border border-mine-shaft-700 rounded-full px-4 py-1.5">
            <IconBolt size={15} className="text-bright-sun-400" />
            <span className="text-sm text-mine-shaft-200">1-click apply</span>
          </div>
          <div className="flex items-center gap-2 bg-mine-shaft-800/60 border border-mine-shaft-700 rounded-full px-4 py-1.5">
            <IconChecklist size={15} className="text-bright-sun-400" />
            <span className="text-sm text-mine-shaft-200">track every step</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6 max-w-xl">
          <TextInput
            className="grow"
            size="md"
            radius="md"
            placeholder="Search a job title, e.g. Software Engineer"
            leftSection={<IconSearch size={18} className="text-bright-sun-400" />}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button size="md" radius="md" color="bright-sun.5" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* right: real recent jobs, floating (decorative, so hidden on small screens) */}
      <div className="hidden lg:flex w-full lg:w-[52%] items-center justify-center">
        <div className="relative w-[26rem] h-[24rem]">
          {/* soft glow behind the cards for depth */}
          <div className="pointer-events-none absolute inset-4 bg-bright-sun-500/10 blur-[90px] rounded-full" />

          {jobs.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-mine-shaft-500 text-sm">
              loading live jobs...
            </div>
          )}

          {jobs[0] && <FloatingJob job={jobs[0]} className="top-0 left-2 animate-float" />}
          {jobs[1] && (
            <FloatingJob
              job={jobs[1]}
              className="top-32 right-0 animate-float [animation-delay:1.2s]"
            />
          )}
          {jobs[2] && (
            <FloatingJob
              job={jobs[2]}
              className="bottom-0 left-10 animate-float [animation-delay:2.4s]"
            />
          )}

          {/* small live indicator instead of the old fake "12k+ got job" badge */}
          <div className="absolute -top-2 right-6 flex items-center gap-2 bg-mine-shaft-800/70 backdrop-blur-md border border-emerald-500/40 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-mine-shaft-100">live data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// one floating, glassmorphic job card built from real backend data
const FloatingJob = ({
  job,
  className,
}: {
  job: JobResponse;
  className: string;
}) => (
  <div
    onClick={() => window.location.assign(`/jobs/${job.id}`)}
    className={`absolute w-60 bg-mine-shaft-800/60 backdrop-blur-md border border-bright-sun-400/30 rounded-xl p-4 shadow-lg shadow-bright-sun-500/10 hover:shadow-bright-sun-500/30 hover:border-bright-sun-400/60 cursor-pointer transition-shadow ${className}`}
  >
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-bright-sun-500/20 flex items-center justify-center text-bright-sun-400">
        <IconBriefcase size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-mine-shaft-100 font-medium truncate">
          {job.title}
        </div>
        <div className="text-xs text-mine-shaft-400 truncate">{job.company}</div>
      </div>
    </div>
    <div className="flex items-center justify-between text-xs text-mine-shaft-400 mt-3">
      <span className="flex items-center gap-1">
        <IconMapPin size={13} /> {job.location || "Remote"}
      </span>
      <span>{jobTypeLabel(job.type) || "Full Time"}</span>
    </div>
    <div className="text-[11px] text-mine-shaft-500 mt-2">
      {daysAgo(job.postedAt) === 0 ? "today" : `${daysAgo(job.postedAt)} days ago`}
    </div>
  </div>
);

export default DreamJob;
