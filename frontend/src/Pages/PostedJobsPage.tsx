import { Tabs, Button } from "@mantine/core";
import { IconClockHour3, IconMapPin, IconUsers } from "@tabler/icons-react";

type PostedJob = {
  title: string;
  location: string;
  postedDaysAgo: number;
  applicants: number;
};


const postedJobs: Record<string, PostedJob[]> = {
  active: [
    { title: "Frontend Developer", location: "Bangalore", postedDaysAgo: 3, applicants: 12 },
    { title: "Backend Developer", location: "Remote", postedDaysAgo: 7, applicants: 8 },
    { title: "UI/UX Designer", location: "Mumbai", postedDaysAgo: 1, applicants: 5 },
  ],
  drafts: [
    { title: "DevOps Engineer", location: "Pune", postedDaysAgo: 0, applicants: 0 },
  ],
  closed: [
    { title: "QA Engineer", location: "Delhi", postedDaysAgo: 30, applicants: 20 },
  ],
};


const PostedJobCard = ({ job, closed }: { job: PostedJob; closed?: boolean }) => (
  <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl p-4 w-full sm:w-96 flex flex-col gap-3">
    <div className="font-semibold text-mine-shaft-100">{job.title}</div>
    <div className="flex flex-wrap gap-4 text-xs text-mine-shaft-400">
      <span className="flex items-center gap-1">
        <IconMapPin size={14} /> {job.location}
      </span>
      <span className="flex items-center gap-1">
        <IconUsers size={14} /> {job.applicants} Applicants
      </span>
      <span className="flex items-center gap-1">
        <IconClockHour3 size={14} /> {job.postedDaysAgo}d ago
      </span>
    </div>
    <div className="flex gap-2">
      <Button size="xs" color="brightSun.4" variant="light">
        View
      </Button>
      {!closed && (
        <Button size="xs" color="brightSun.4" variant="outline">
          Edit
        </Button>
      )}
      {!closed && (
        <Button size="xs" color="red" variant="light">
          Close
        </Button>
      )}
    </div>
  </div>
);


const JobGrid = ({ jobs, closed }: { jobs: PostedJob[]; closed?: boolean }) => {
  if (jobs.length === 0) {
    return <div className="text-mine-shaft-400 mt-6">No jobs here yet.</div>;
  }
  return (
    <div className="flex flex-wrap gap-5 mt-6">
      {jobs.map((job, i) => (
        <PostedJobCard key={i} job={job} closed={closed} />
      ))}
    </div>
  );
};

const PostedJobsPage = () => {
  return (
    <div className="p-4 md:p-8 min-h-[90vh]">
      <div className="text-2xl font-semibold text-mine-shaft-100 mb-5">Posted Jobs</div>

      <Tabs color="brightSun.4" defaultValue="active">
        <Tabs.List>
          <Tabs.Tab value="active">Active [{postedJobs.active.length}]</Tabs.Tab>
          <Tabs.Tab value="drafts">Drafts [{postedJobs.drafts.length}]</Tabs.Tab>
          <Tabs.Tab value="closed">Closed [{postedJobs.closed.length}]</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="active">
          <JobGrid jobs={postedJobs.active} />
        </Tabs.Panel>
        <Tabs.Panel value="drafts">
          <JobGrid jobs={postedJobs.drafts} />
        </Tabs.Panel>
        <Tabs.Panel value="closed">
          <JobGrid jobs={postedJobs.closed} closed />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default PostedJobsPage;
