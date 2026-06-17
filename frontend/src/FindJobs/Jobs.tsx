import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { searchJobs, JobResponse, JobFilters } from "../api/jobs";
import { toCardProps } from "./jobMappers";
import JobCard from "./JobCard";
import Sort from "./Sort";

// maps the Sort dropdown label to the backend 'sort' param (server-side sorting)
const sortParam: Record<string, string | undefined> = {
  Relevance: "postedAt,desc",
  "Most Recent": "postedAt,desc",
  "Salary (Low to High)": "salaryMin,asc",
  "Salary (High to Low)": "salaryMax,desc",
};

const PAGE_SIZE = 9;

const Jobs = ({ filters }: { filters: JobFilters }) => {
  const [sort, setSort] = useState("Relevance");
  const [page, setPage] = useState(0);

  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // when filters or sort change, go back to the first page
  useEffect(() => {
    setPage(0);
  }, [filters.title, filters.location, filters.type, sort]);

  // fetch jobs whenever filters / sort / page change
  useEffect(() => {
    let active = true; // purani (stale) response ko ignore karne ke liye
    setLoading(true);
    setError(false);

    searchJobs({
      title: filters.title || undefined,
      location: filters.location || undefined,
      type: filters.type || undefined,
      page,
      size: PAGE_SIZE,
      sort: sortParam[sort],
    })
      .then((data) => {
        if (!active) return;
        setJobs(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters.title, filters.location, filters.type, sort, page]);

  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-2xl font-semibold">Recommended Jobs</div>
        <Sort value={sort} onChange={setSort} />
      </div>

      {loading && <div className="text-mine-shaft-300">Loading jobs...</div>}
      {error && <div className="text-red-400">Couldn't load jobs. Please try again.</div>}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-mine-shaft-300">No jobs found for this search.</div>
      )}

      <div className="flex flex-wrap gap-5 mt-3 justify-center lg:justify-start">
        {jobs.map((job) => (
          <JobCard key={job.id} {...toCardProps(job)} />
        ))}
      </div>

      {/* pagination, only when there's more than one page */}
      {totalPages > 1 && (
        <div className="flex gap-3 justify-center items-center mt-8">
          <Button
            variant="outline"
            color="bright-sun.4"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-mine-shaft-300 text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            color="bright-sun.4"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
