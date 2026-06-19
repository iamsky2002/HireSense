import { useState, useEffect } from "react";
import { Tabs, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { getMyApplications, ApplicationResponse, ApplicationStatus, statusLabel } from "../api/applications";
import { jobTypeLabel, daysAgo } from "../FindJobs/jobMappers";

// badge color per status
const statusColors: Record<ApplicationStatus, string> = {
  APPLIED: "text-bright-sun-400",
  UNDER_REVIEW: "text-cyan-400",
  SHORTLISTED: "text-blue-400",
  ASSESSMENT: "text-violet-400",
  INTERVIEW: "text-indigo-400",
  OFFERED: "text-emerald-400",
  HIRED: "text-green-400",
  REJECTED: "text-red-400",
};

// one application card (with status badge)
const ApplicationCard = ({ app }: { app: ApplicationResponse }) => (
  <div className="bg-mine-shaft-900 p-4 w-72 rounded-xl border border-mine-shaft-700 flex flex-col gap-2">
    <div className="font-bold text-mine-shaft-100">{app.jobTitle}</div>
    <div className="text-xs text-mine-shaft-400">
      {app.company}
      {app.location ? ` • ${app.location}` : ""}
    </div>
    <div className="flex flex-wrap gap-2 text-xs">
      {app.type && (
        <span className="py-1 px-2 bg-mine-shaft-800 text-bright-sun-400 rounded-lg">
          {jobTypeLabel(app.type)}
        </span>
      )}
      <span className={`py-1 px-2 bg-mine-shaft-800 rounded-lg font-semibold ${statusColors[app.status]}`}>
        {statusLabel[app.status]}
      </span>
    </div>
    <div className="text-xs text-mine-shaft-400">Applied {daysAgo(app.appliedAt)} days ago</div>
    <Link to={`/jobs/${app.jobId}`}>
      <Button color="brightSun.4" variant="light" fullWidth size="xs">
        View Job
      </Button>
    </Link>
  </div>
);

const JobHistoryPage = () => {
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getMyApplications()
      .then((data) => active && setApps(data))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // no status = all applications, otherwise filter by that status
  const byStatus = (status?: ApplicationStatus) =>
    status ? apps.filter((a) => a.status === status) : apps;

  const renderGrid = (list: ApplicationResponse[]) => {
    if (loading) return <div className="text-mine-shaft-300 mt-6">Loading...</div>;
    if (error) return <div className="text-red-400 mt-6">Couldn't load applications.</div>;
    if (list.length === 0) return <div className="text-mine-shaft-400 mt-6">Nothing to show here yet.</div>;
    return (
      <div className="flex flex-wrap gap-5 mt-6 justify-center lg:justify-start">
        {list.map((a) => (
          <ApplicationCard key={a.applicationId} app={a} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 min-h-[90vh]">
      <div className="text-2xl font-semibold text-mine-shaft-100 mb-5">My Applications</div>

      <Tabs color="brightSun.4" defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="applied">Applied</Tabs.Tab>
          <Tabs.Tab value="shortlisted">Shortlisted</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
          <Tabs.Tab value="hired">Hired</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">{renderGrid(byStatus())}</Tabs.Panel>
        <Tabs.Panel value="applied">{renderGrid(byStatus("APPLIED"))}</Tabs.Panel>
        <Tabs.Panel value="shortlisted">{renderGrid(byStatus("SHORTLISTED"))}</Tabs.Panel>
        <Tabs.Panel value="rejected">{renderGrid(byStatus("REJECTED"))}</Tabs.Panel>
        <Tabs.Panel value="hired">{renderGrid(byStatus("HIRED"))}</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default JobHistoryPage;
