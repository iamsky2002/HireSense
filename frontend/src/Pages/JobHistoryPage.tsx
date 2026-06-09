import { Tabs } from "@mantine/core";
import JobCard from "../FindJobs/JobCard";
import { jobList } from "../Data/JobsData";


const historyData: Record<string, number[]> = {
  applied: [0, 2, 4],
  saved: [1, 5],
  offered: [3],
  inProgress: [],
};


const JobGrid = ({ ids }: { ids: number[] }) => {
  if (ids.length === 0) {
    return <div className="text-mine-shaft-400 mt-6">Nothing to show here yet.</div>;
  }
  return (
    <div className="flex flex-wrap gap-5 mt-6 justify-center lg:justify-start">
      {ids.map((i) => (
        <JobCard key={i} id={i} {...jobList[i]} />
      ))}
    </div>
  );
};

const JobHistoryPage = () => {
  return (
    <div className="p-4 md:p-8 min-h-[90vh]">
      <div className="text-2xl font-semibold text-mine-shaft-100 mb-5">Job History</div>

      <Tabs color="brightSun.4" defaultValue="applied">
        <Tabs.List>
          <Tabs.Tab value="applied">Applied</Tabs.Tab>
          <Tabs.Tab value="saved">Saved</Tabs.Tab>
          <Tabs.Tab value="offered">Offered</Tabs.Tab>
          <Tabs.Tab value="inProgress">In Progress</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="applied">
          <JobGrid ids={historyData.applied} />
        </Tabs.Panel>
        <Tabs.Panel value="saved">
          <JobGrid ids={historyData.saved} />
        </Tabs.Panel>
        <Tabs.Panel value="offered">
          <JobGrid ids={historyData.offered} />
        </Tabs.Panel>
        <Tabs.Panel value="inProgress">
          <JobGrid ids={historyData.inProgress} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default JobHistoryPage;
