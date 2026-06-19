import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMyApplications, ApplicationResponse } from "../api/applications";
import { getMyProfile, ProfileResponse } from "../api/profile";
import { searchJobs, JobResponse } from "../api/jobs";
import DashboardStats from "../Dashboard/DashboardStats";
import ProfileCompleteness from "../Dashboard/ProfileCompleteness";
import ApplicationTracker from "../Dashboard/ApplicationTracker";
import RecommendedJobs from "../Dashboard/RecommendedJobs";

// rule-based skill-overlap for now; Phase 4 will swap this for AI embeddings
const rankBySkillOverlap = (
  jobs: JobResponse[],
  candidateSkills: string[],
  appliedJobIds: Set<number>
) => {
  const skillSet = new Set(candidateSkills.map((s) => s.toLowerCase()));
  const pool = jobs.filter((j) => !appliedJobIds.has(j.id));

  const scored = pool
    .map((job) => ({
      job,
      score: job.skills.filter((s) => skillSet.has(s.toLowerCase())).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // fall back to latest jobs when nothing matches
  const matchedBySkill = scored.length > 0;
  const list = (matchedBySkill ? scored.map((x) => x.job) : pool).slice(0, 4);
  return { list, matchedBySkill };
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // each call fails independently so one error doesn't blank the page
    Promise.all([
      getMyApplications().catch(() => [] as ApplicationResponse[]),
      getMyProfile().catch(() => null),
      searchJobs({ size: 50, sort: "postedAt,desc" })
        .then((p) => p.content)
        .catch(() => [] as JobResponse[]),
    ]).then(([appsData, profileData, jobsData]) => {
      if (!active) return;
      setApps(appsData);
      setProfile(profileData);
      setJobs(jobsData);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const appliedJobIds = new Set(apps.map((a) => a.jobId));
  const { list: recommended, matchedBySkill } = rankBySkillOverlap(
    jobs,
    profile?.skills ?? [],
    appliedJobIds
  );

  if (loading) {
    return <div className="p-8 text-mine-shaft-300 min-h-[90vh]">Loading your dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 min-h-[90vh] flex flex-col gap-6">
      <div>
        <div className="text-2xl font-semibold text-mine-shaft-100">
          Welcome back, <span className="text-bright-sun-400">{firstName}</span> 👋
        </div>
        <div className="text-sm text-mine-shaft-400">Here's how your job hunt is going.</div>
      </div>

      <DashboardStats apps={apps} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ApplicationTracker apps={apps} />
          <RecommendedJobs jobs={recommended} matchedBySkill={matchedBySkill} />
        </div>
        <div className="lg:col-span-1">
          <ProfileCompleteness profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
