import { Link } from "react-router-dom";
import { useSavedJobs } from "../SavedJobs/SavedJobsContext";
import JobCard from "../FindJobs/JobCard";
import { toCardProps } from "../FindJobs/jobMappers";

const SavedJobsSection = () => {
  const { savedJobs } = useSavedJobs();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-mine-shaft-100">
          Saved jobs {savedJobs.length > 0 && <span className="text-bright-sun-400">({savedJobs.length})</span>}
        </div>
        <Link to="/find-jobs" className="text-xs text-bright-sun-400 hover:underline">
          Find more
        </Link>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-6 text-center text-mine-shaft-400 text-sm">
          No saved jobs yet. Tap the bookmark on any job to save it here.
        </div>
      ) : (
        <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
          {savedJobs.map((job) => (
            <JobCard key={job.id} {...toCardProps(job)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsSection;
