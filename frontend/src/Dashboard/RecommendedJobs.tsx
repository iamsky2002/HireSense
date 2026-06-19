import { Link } from "react-router-dom";
import { JobResponse } from "../api/jobs";
import JobCard from "../FindJobs/JobCard";
import { toCardProps } from "../FindJobs/jobMappers";

// ranking already done in the page (skill-overlap); this just lays it out
const RecommendedJobs = ({
  jobs,
  matchedBySkill,
}: {
  jobs: JobResponse[];
  matchedBySkill: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-mine-shaft-100">Recommended for you</div>
        <Link to="/find-jobs" className="text-xs text-bright-sun-400 hover:underline">
          See all jobs
        </Link>
      </div>

      <div className="text-xs text-mine-shaft-400 -mt-2">
        {matchedBySkill
          ? "Based on how well each job matches your skills."
          : "Add skills to your profile for personalized matches. Showing the latest jobs for now."}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-6 text-center text-mine-shaft-400 text-sm">
          No jobs to show right now.
        </div>
      ) : (
        <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
          {jobs.map((job) => (
            <JobCard key={job.id} {...toCardProps(job)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedJobs;
