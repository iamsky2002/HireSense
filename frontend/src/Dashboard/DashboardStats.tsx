import { IconBriefcase, IconStar, IconTrophy } from "@tabler/icons-react";
import { ApplicationResponse } from "../api/applications";

// the middle pipeline stages count as "in progress"
const ACTIVE_STAGES = ["UNDER_REVIEW", "SHORTLISTED", "ASSESSMENT", "INTERVIEW", "OFFERED"];

const DashboardStats = ({ apps }: { apps: ApplicationResponse[] }) => {
  const inProgress = apps.filter((a) => ACTIVE_STAGES.includes(a.status)).length;
  const hired = apps.filter((a) => a.status === "HIRED").length;

  const cards = [
    { label: "Applications", value: apps.length, icon: IconBriefcase, color: "text-bright-sun-400" },
    { label: "In Progress", value: inProgress, icon: IconStar, color: "text-blue-400" },
    { label: "Hired", value: hired, icon: IconTrophy, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg bg-mine-shaft-800 ${c.color}`}>
              <Icon size={26} stroke={1.5} />
            </div>
            <div>
              <div className="text-3xl font-bold text-mine-shaft-100">{c.value}</div>
              <div className="text-sm text-mine-shaft-400">{c.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
