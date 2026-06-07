import { useState, useMemo } from "react";
import { jobList } from "../Data/JobsData";
import JobCard from "./JobCard";
import Sort from "./Sort";

const Jobs = () => {
  const [sort, setSort] = useState("Relevance");

  const sortedJobs = useMemo(() => {
    const jobs = [...jobList];
    switch (sort) {
      case "Most Recent":
        return jobs.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
      case "Salary (Low to High)":
        return jobs.sort(
          (a, b) => parseInt(a.package) - parseInt(b.package)
        );
      case "Salary (High to Low)":
        return jobs.sort(
          (a, b) => parseInt(b.package) - parseInt(a.package)
        );
      default:
        return jobs;
    }
  }, [sort]);

  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-2xl font-semibold">Recommended Jobs</div>
        <Sort value={sort} onChange={setSort} />
      </div>
      <div className="flex flex-wrap gap-5 mt-3 justify-center lg:justify-start">
        {sortedJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
