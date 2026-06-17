import { useState, useEffect, useMemo } from "react";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { getCandidates, CandidateSummaryResponse } from "../api/candidates";
import TalentCard from "./TalentCard";

const Talents = () => {
  const [candidates, setCandidates] = useState<CandidateSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  // fetch all candidates once (list is small, so client-side search is fine)
  useEffect(() => {
    let active = true;
    getCandidates()
      .then((d) => active && setCandidates(d))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // client-side search by name, headline or skill
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        (c.headline || "").toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [query, candidates]);

  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
        <div className="text-2xl font-semibold">Talents</div>
        <TextInput
          placeholder="Search by name or skill"
          leftSection={<IconSearch size={18} className="text-bright-sun-400" />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          className="min-w-[240px]"
        />
      </div>

      {loading && <div className="text-mine-shaft-300">Loading talents...</div>}
      {error && <div className="text-red-400">Couldn't load talents.</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-mine-shaft-400">No candidates found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <TalentCard
            key={c.userId}
            userId={c.userId}
            name={c.fullName}
            role={c.headline || "Candidate"}
            topSkills={c.skills}
            expectedCtc={c.expectedCtc || ""}
            experienceYears={c.experienceYears}
          />
        ))}
      </div>
    </div>
  );
};

export default Talents;
