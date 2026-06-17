import { useState, useEffect } from "react";
import { Avatar, Badge, Button, Divider } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import { IconChevronLeft, IconBriefcase, IconCurrencyRupee } from "@tabler/icons-react";
import { getCandidate, CandidateSummaryResponse } from "../api/candidates";

const TalentProfilePage = () => {
  const { id } = useParams();

  const [candidate, setCandidate] = useState<CandidateSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getCandidate(Number(id))
      .then((d) => active && setCandidate(d))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-mine-shaft-300">Loading profile...</div>;
  }

  if (notFound || !candidate) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-mine-shaft-200">Candidate not found.</div>
        <Link to="/find-talent">
          <Button color="bright-sun.4" variant="light" leftSection={<IconChevronLeft size={18} />}>
            Back to talents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-mine-shaft-950 p-6">
      <Link className="my-5 inline-block" to="/find-talent">
        <Button color="bright-sun.4" variant="light" leftSection={<IconChevronLeft size={18} />}>
          Back
        </Button>
      </Link>

      <Divider size="xs" />

      <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-6 mt-5 max-w-2xl flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar name={candidate.fullName} color="initials" size="xl" className="rounded-full" />
          <div>
            <div className="text-2xl font-semibold text-mine-shaft-100">{candidate.fullName}</div>
            <div className="text-mine-shaft-400">{candidate.headline || "Candidate"}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-mine-shaft-300">
          {candidate.experienceYears != null && (
            <span className="flex items-center gap-2">
              <IconBriefcase size={18} className="text-bright-sun-400" />
              {candidate.experienceYears} years experience
            </span>
          )}
          {candidate.expectedCtc && (
            <span className="flex items-center gap-2">
              <IconCurrencyRupee size={18} className="text-bright-sun-400" />
              {candidate.expectedCtc}
            </span>
          )}
        </div>

        <Divider color="mine-shaft.7" />

        <div>
          <div className="text-lg font-semibold text-mine-shaft-100 mb-3">Skills</div>
          {candidate.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge
                  key={skill}
                  size="md"
                  variant="light"
                  color="bright-sun.4"
                  className="!text-bright-sun-400 !bg-mine-shaft-800"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-mine-shaft-400 text-sm">No skills listed yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentProfilePage;
