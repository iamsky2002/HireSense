import { useEmployerApplicants } from "../Employer/useEmployerApplicants";
import JobApplicants from "../Employer/JobApplicants";

const PostedJobsPage = () => {
  const { jobs, appsByJob, loading, error, setStatus } = useEmployerApplicants();

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
          <JobApplicants
            key={job.id}
            job={job}
            applicants={appsByJob[job.id] || []}
            onStatusChange={(appId, status) => setStatus(job.id, appId, status)}
          />
        ))}
      </div>
    </div>
  );
};

export default PostedJobsPage;
