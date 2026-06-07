import SearchBar from "../FindJobs/SearchBar";
import Jobs from "../FindJobs/Jobs";

const FindJobsPage = () => {
  return (
    <div className="min-h-screen bg-mine-shaft-950">
      <SearchBar />
      <Jobs />
    </div>
  );
};

export default FindJobsPage;
