import { ReactNode, useState, useEffect } from "react";
import { Button, Divider } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconBookmark,
  IconMapPin,
  IconBriefcase,
  IconCurrencyRupee,
  IconClockHour3,
} from "@tabler/icons-react";
import { getJob, searchJobs, JobResponse } from "../api/jobs";
import { applyToJob } from "../api/applications";
import { jobTypeLabel, daysAgo, salaryText, toCardProps } from "../FindJobs/jobMappers";
import { parseSections } from "../Data/jobSections";
import JobCard from "../FindJobs/JobCard";

const JobDescPage = () => {
  const { id } = useParams();
  const jobId = Number(id);

  const [job, setJob] = useState<JobResponse | null>(null);
  const [recommended, setRecommended] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // apply button state
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // fetch this job from the backend
  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    getJob(jobId)
      .then((data) => active && setJob(data))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [jobId]);

  // a few recent jobs for the sidebar (excluding the current one)
  useEffect(() => {
    let active = true;
    searchJobs({ size: 4, sort: "postedAt,desc" })
      .then((data) => {
        if (active) setRecommended(data.content.filter((j) => j.id !== jobId).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [jobId]);

  const handleApply = async () => {
    setApplyMsg(null);
    try {
      setApplying(true);
      await applyToJob(jobId);
      setApplyMsg({ ok: true, text: "Application submitted!" });
    } catch (err) {
      const status = (err as any)?.response?.status;
      const text =
        status === 409
          ? "You have already applied to this job."
          : status === 403
          ? "Log in with a candidate account to apply."
          : "Something went wrong. Please try again.";
      setApplyMsg({ ok: false, text });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-mine-shaft-300">Loading job...</div>;
  }

  // Invalid / deleted job id
  if (notFound || !job) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-mine-shaft-200">Job not found.</div>
        <Link to="/find-jobs">
          <Button color="brightSun.4" variant="light" leftSection={<IconArrowLeft size={18} />}>
            Back to jobs
          </Button>
        </Link>
      </div>
    );
  }

  const salary =
    job.salaryMin == null && job.salaryMax == null
      ? "Not disclosed"
      : `₹${salaryText(job.salaryMin, job.salaryMax)}`;

  return (
    <div className="min-h-[90vh] p-4 md:p-8">
      <Link className="inline-block mb-6" to="/find-jobs">
        <Button color="brightSun.4" variant="light" leftSection={<IconArrowLeft size={18} />}>
          Back
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: job detail */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Title + Apply */}
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex gap-4 items-center">
              <div className="p-2 bg-mine-shaft-800 rounded-lg shrink-0">
                <img
                  className="h-12 w-12 object-contain"
                  src={`/Icons/${job.company}.png`}
                  alt={`${job.company} logo`}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div>
                <div className="text-2xl font-semibold text-mine-shaft-100">{job.title}</div>
                <div className="text-sm text-mine-shaft-400 mt-1 flex items-center gap-1">
                  {job.company} &#x2022;
                  <IconClockHour3 size={14} /> {daysAgo(job.postedAt)} days ago
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <Button color="brightSun.4" autoContrast onClick={handleApply} loading={applying}>
                  Apply
                </Button>
                <IconBookmark className="text-mine-shaft-300 cursor-pointer hover:text-bright-sun-400 transition-colors" />
              </div>
              {applyMsg && (
                <div className={`text-sm ${applyMsg.ok ? "text-green-400" : "text-red-400"}`}>
                  {applyMsg.text}
                </div>
              )}
            </div>
          </div>

          <Divider color="mine-shaft.7" />

          {/* Quick facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Fact icon={<IconMapPin />} label="Location" value={job.location || "—"} />
            <Fact icon={<IconBriefcase />} label="Experience" value={job.experience || "—"} />
            <Fact icon={<IconCurrencyRupee />} label="Salary" value={salary} />
            <Fact icon={<IconClockHour3 />} label="Job Type" value={jobTypeLabel(job.type) || "—"} />
          </div>

          <Divider color="mine-shaft.7" />

          {/* required skills from the backend */}
          <div>
            <div className="text-lg font-semibold text-mine-shaft-100 mb-3">Required Skills</div>
            {job.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="py-1 px-3 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-mine-shaft-400 text-sm">No specific skills listed.</div>
            )}
          </div>

          <Divider color="mine-shaft.7" />

          {/* Description — structured sections when present, else one "About" block */}
          <JobDescriptionSections description={job.description} />
        </div>

        {/* Right: recommended jobs */}
        <aside className="flex flex-col gap-4 shrink-0">
          <div className="text-lg font-semibold text-mine-shaft-100">Recommended Jobs</div>
          {recommended.map((rec) => (
            <JobCard key={rec.id} {...toCardProps(rec)} />
          ))}
        </aside>
      </div>
    </div>
  );
};

// renders the description as sections (About / Responsibilities / Qualifications),
// falling back to a single "About The Job" block for older plain descriptions
const JobDescriptionSections = ({ description }: { description: string }) => {
  const sections = parseSections(description) || [{ title: "About The Job", body: description }];
  return (
    <div className="flex flex-col gap-6">
      {sections.map((s) => (
        <div key={s.title}>
          <div className="text-lg font-semibold text-mine-shaft-100 mb-2">{s.title}</div>
          <p className="text-mine-shaft-300 text-justify whitespace-pre-line">{s.body}</p>
        </div>
      ))}
    </div>
  );
};

// Small helper for the quick-fact boxes
const Fact = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center text-center gap-1 bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl p-4">
    <div className="text-bright-sun-400">{icon}</div>
    <div className="text-xs text-mine-shaft-400">{label}</div>
    <div className="text-mine-shaft-100 font-medium">{value}</div>
  </div>
);

export default JobDescPage;
