import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../FindJobs/SearchBar";
import Jobs from "../FindJobs/Jobs";
import { JobFilters } from "../api/jobs";

const FindJobsPage = () => {
  // the hero search sends people here with ?title=..., so pick that up as the starting filter
  const [params] = useSearchParams();
  const initialTitle = params.get("title") || "";

  // filters live here (lifted state): SearchBar sets them, Jobs reads them
  const [filters, setFilters] = useState<JobFilters>({
    title: initialTitle,
    location: "",
    type: "",
  });

  return (
    <div className="min-h-screen bg-mine-shaft-950">
      <SearchBar onSearch={setFilters} initialTitle={initialTitle} />
      <Jobs filters={filters} />
    </div>
  );
};

export default FindJobsPage;
