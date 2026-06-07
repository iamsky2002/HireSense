import { useState } from "react";
import { RangeSlider } from "@mantine/core";
import MultiInput from "../Components/MultiInput";
import { dropdownData } from "../Data/JobsData";

const SearchBar = () => {
  const [salaryRange, setSalaryRange] = useState<[number, number]>([3, 81]);

  return (
    <div className="bg-mine-shaft-900 border-b border-mine-shaft-700 sticky top-0 z-10 shadow-md shadow-mine-shaft-950">
      <div className="flex items-center px-6 py-4 gap-3">
        {dropdownData.map((item, index) => (
          <div key={index} className="flex-1 min-w-0">
            <MultiInput {...item} />
          </div>
        ))}

        <div className="h-10 w-px bg-mine-shaft-600 shrink-0" />

        <div className="flex flex-col gap-1 min-w-[180px] max-w-[220px]">
          <div className="flex justify-between items-center text-mine-shaft-300 text-xs font-medium px-1">
            <span>Salary</span>
            <span className="text-bright-sun-400 font-semibold text-xs">
              ₹{salaryRange[0]} LPA &ndash; ₹{salaryRange[1]} LPA
            </span>
          </div>
          <RangeSlider
            min={0}
            max={150}
            step={1}
            value={salaryRange}
            onChange={setSalaryRange}
            label={null}
            color="bright-sun.4"
            size="sm"
            styles={{
              track: { backgroundColor: "var(--mantine-color-mine-shaft-7)" },
              thumb: {
                borderColor: "var(--mantine-color-bright-sun-4)",
                backgroundColor: "var(--mantine-color-bright-sun-4)",
                width: 14,
                height: 14,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
