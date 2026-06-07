import { useState, useMemo } from "react";
import { talents } from "../Data/TalentData";
import TalentCard from "./TalentCard";
import Sort from "../FindJobs/Sort";

const Talents = () => {
  const [sort, setSort] = useState("Relevance");

  const sortedTalents = useMemo(() => {
    const list = [...talents];
    switch (sort) {
      case "Salary (Low to High)":
        return list.sort(
          (a, b) => parseInt(a.expectedCtc.replace("₹", "")) - parseInt(b.expectedCtc.replace("₹", ""))
        );
      case "Salary (High to Low)":
        return list.sort(
          (a, b) => parseInt(b.expectedCtc.replace("₹", "")) - parseInt(a.expectedCtc.replace("₹", ""))
        );
      default:
        // Relevance or Most Recent (since talents don't have a date field, we keep default order)
        return list;
    }
  }, [sort]);

  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-2xl font-semibold">Talents</div>
        <Sort value={sort} onChange={setSort} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedTalents.map((talent, index) => (
          <TalentCard key={index} {...talent} />
        ))}
      </div>
    </div>
  );
};

export default Talents;

