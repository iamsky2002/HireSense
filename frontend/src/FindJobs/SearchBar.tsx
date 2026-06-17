import { useState } from "react";
import { TextInput, Select, Button } from "@mantine/core";
import { IconSearch, IconMapPin } from "@tabler/icons-react";
import { JobFilters } from "../api/jobs";

// friendly Job Type labels; value matches the backend EmploymentType enum
const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

// backend search only filters on title/location/type, so just those 3 here
// (salary-range / experience filter not in backend search yet, future enhancement)
const SearchBar = ({
  onSearch,
  initialTitle = "",
}: {
  onSearch: (filters: JobFilters) => void;
  initialTitle?: string;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [location, setLocation] = useState("");
  const [type, setType] = useState<string>("");

  const apply = () =>
    onSearch({ title: title.trim(), location: location.trim(), type: type as JobFilters["type"] });

  const clear = () => {
    setTitle("");
    setLocation("");
    setType("");
    onSearch({ title: "", location: "", type: "" });
  };

  return (
    <div className="bg-mine-shaft-900 border-b border-mine-shaft-700 sticky top-0 z-10 shadow-md shadow-mine-shaft-950">
      <div className="flex items-center px-6 py-4 gap-3 flex-wrap">
        <TextInput
          placeholder="Job title (e.g. Developer)"
          leftSection={<IconSearch size={18} className="text-bright-sun-400" />}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="flex-1 min-w-[180px]"
        />

        <TextInput
          placeholder="Location"
          leftSection={<IconMapPin size={18} className="text-bright-sun-400" />}
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="flex-1 min-w-[160px]"
        />

        <Select
          placeholder="Job Type"
          data={jobTypeOptions}
          value={type}
          onChange={(val) => setType(val || "")}
          clearable
          className="min-w-[160px]"
        />

        <Button color="bright-sun.4" onClick={apply}>
          Search
        </Button>
        <Button variant="outline" color="bright-sun.4" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
