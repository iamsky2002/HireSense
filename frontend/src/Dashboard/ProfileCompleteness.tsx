import { Progress, Button } from "@mantine/core";
import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { ProfileResponse } from "../api/profile";

const ProfileCompleteness = ({ profile }: { profile: ProfileResponse | null }) => {
  if (!profile) return null;

  const checks = [
    { label: "Add a headline", done: !!profile.headline },
    { label: "Add your skills", done: profile.skills.length > 0 },
    { label: "Set your experience", done: profile.experienceYears != null },
    { label: "Upload your resume", done: !!profile.resumeUrl },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checks.length) * 100);

  const nextStep = checks.find((c) => !c.done);
  // even with some skills, nudge to add more (under 3) for better matching
  const skillNudge =
    profile.skills.length > 0 && profile.skills.length < 3
      ? `Add ${3 - profile.skills.length} more skill${3 - profile.skills.length > 1 ? "s" : ""} to stand out`
      : null;

  return (
    <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-mine-shaft-100">Profile strength</div>
        <div className="text-bright-sun-400 font-bold">{pct}%</div>
      </div>

      <Progress value={pct} color="brightSun.4" size="md" radius="xl" />

      <div className="flex flex-col gap-2">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2 text-sm">
            {c.done ? (
              <IconCircleCheck size={18} className="text-green-400 shrink-0" />
            ) : (
              <IconCircleDashed size={18} className="text-mine-shaft-500 shrink-0" />
            )}
            <span className={c.done ? "text-mine-shaft-400 line-through" : "text-mine-shaft-200"}>
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {(nextStep || skillNudge) && (
        <div className="text-xs text-mine-shaft-400">
          💡 {nextStep ? nextStep.label : skillNudge}
        </div>
      )}

      <Link to="/my-profile">
        <Button color="brightSun.4" variant="light" fullWidth size="sm">
          {pct === 100 ? "Edit profile" : "Complete profile"}
        </Button>
      </Link>
    </div>
  );
};

export default ProfileCompleteness;
