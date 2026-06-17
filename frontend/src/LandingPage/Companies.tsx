import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { searchJobs } from "../api/jobs";

// Scrolling list of companies that are actually hiring on the platform (pulled from real jobs).
const Companies = () => {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    searchJobs({ page: 0, size: 50 })
      .then((d) => {
        const unique = Array.from(
          new Set(d.content.map((j) => j.company).filter(Boolean))
        );
        setCompanies(unique);
      })
      .catch(() => {});
  }, []);

  // nothing real to show yet, so don't render a fake section
  if (companies.length === 0) return null;

  return (
    <div className="mt-16 pb-5">
      <div className="text-3xl text-center font-semibold mb-8 text-mine-shaft-100">
        Companies hiring on{" "}
        <span className="text-bright-sun-400">HireSense</span>
      </div>
      <Marquee pauseOnHover={true}>
        {companies.map((company, index) => (
          <div
            key={index}
            className="mx-5 px-6 py-2 bg-mine-shaft-800 border border-mine-shaft-700 rounded-xl text-mine-shaft-100 font-medium hover:border-bright-sun-400/50 transition-colors"
          >
            {company}
          </div>
        ))}
      </Marquee>
    </div>
  );
};
export default Companies;
