import { useState } from "react";
import SearchBar from "../FindJobs/SearchBar";
import Jobs from "../FindJobs/Jobs";
import { JobFilters } from "../api/jobs";

const FindJobsPage = () => {
  // filters live here (lifted state): SearchBar sets them, Jobs reads them
  const [filters, setFilters] = useState<JobFilters>({ title: "", location: "", type: "" });

  return (
    <div className="min-h-screen bg-mine-shaft-950">
      <SearchBar onSearch={setFilters} />
      <Jobs filters={filters} />
    </div>
  );
};

export default FindJobsPage;
