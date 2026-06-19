import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { useAuth } from "../auth/AuthContext";
import { useEmployerApplicants } from "../Employer/useEmployerApplicants";
import EmployerStats from "../Employer/EmployerStats";
import JobApplicants from "../Employer/JobApplicants";

const EmployerDashboardPage = () => {
  const { user } = useAuth();
  const { jobs, appsByJob, loading, setStatus } = useEmployerApplicants();

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const allApplicants = Object.values(appsByJob).flat();

  if (loading) {
    return <div className="p-8 text-mine-shaft-300 min-h-[90vh]">Loading your dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 min-h-[90vh] flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-2xl font-semibold text-mine-shaft-100">
            Welcome back, <span className="text-bright-sun-400">{firstName}</span> 👋
          </div>
          <div className="text-sm text-mine-shaft-400">
            Manage your jobs and move candidates through the hiring pipeline.
          </div>
        </div>
        <Link to="/post-job">
          <Button color="brightSun.4" autoContrast>
            + Post a Job
          </Button>
        </Link>
      </div>

      <EmployerStats jobCount={jobs.length} applicants={allApplicants} />

      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-mine-shaft-100">Your jobs & applicants</div>
        {jobs.length === 0 ? (
          <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-6 text-center text-mine-shaft-400 text-sm">
            You haven't posted any jobs yet.{" "}
            <Link to="/post-job" className="text-bright-sun-400 hover:underline">
              Post one →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {jobs.map((job) => (
              <JobApplicants
                key={job.id}
                job={job}
                applicants={appsByJob[job.id] || []}
                onStatusChange={(appId, status) => setStatus(job.id, appId, status)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
