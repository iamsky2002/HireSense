import { ReactNode } from "react";
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
import { jobList } from "../Data/JobsData";
import JobCard from "../FindJobs/JobCard";


const requiredSkills = ["React", "TypeScript", "Java", "Spring Boot", "SQL", "Docker", "REST APIs"];


const responsibilities = [
  "Design, build, test and ship features across the stack",
  "Write clean, readable and well-tested code",
  "Work with the team through the full development cycle",
  "Review code and help debug production issues",
];

const JobDescPage = () => {
  const { id } = useParams();
  const job = jobList[Number(id)];

  
  const recommended = jobList
    .map((j, i) => ({ job: j, i }))
    .filter((x) => x.i !== Number(id))
    .slice(0, 3);

  
  if (!job) {
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

  return (
    <div className="min-h-[90vh] p-4 md:p-8">
      <Link className="inline-block mb-6" to="/find-jobs">
        <Button color="brightSun.4" variant="light" leftSection={<IconArrowLeft size={18} />}>
          Back
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex gap-4 items-center">
              <div className="p-2 bg-mine-shaft-800 rounded-lg shrink-0">
                <img
                  className="h-12 w-12 object-contain"
                  src={`/Icons/${job.company}.png`}
                  alt={`${job.company} logo`}
                />
              </div>
              <div>
                <div className="text-2xl font-semibold text-mine-shaft-100">{job.jobTitle}</div>
                <div className="text-sm text-mine-shaft-400 mt-1 flex items-center gap-1">
                  {job.company} &#x2022; {job.applicants} Applicants &#x2022;
                  <IconClockHour3 size={14} /> {job.postedDaysAgo} days ago
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button color="brightSun.4" autoContrast>
                Apply
              </Button>
              <IconBookmark className="text-mine-shaft-300 cursor-pointer hover:text-bright-sun-400 transition-colors" />
            </div>
          </div>

          <Divider color="mine-shaft.7" />

          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Fact icon={<IconMapPin />} label="Location" value={job.location} />
            <Fact icon={<IconBriefcase />} label="Experience" value={job.experience} />
            <Fact icon={<IconCurrencyRupee />} label="Salary" value={`₹${job.package}`} />
            <Fact icon={<IconClockHour3 />} label="Job Type" value={job.jobType} />
          </div>

          <Divider color="mine-shaft.7" />

          
          <div>
            <div className="text-lg font-semibold text-mine-shaft-100 mb-3">Required Skills</div>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="py-1 px-3 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <Divider color="mine-shaft.7" />

          
          <div>
            <div className="text-lg font-semibold text-mine-shaft-100 mb-2">About The Job</div>
            <p className="text-mine-shaft-300 text-justify">{job.description}</p>
          </div>

          
          <div>
            <div className="text-lg font-semibold text-mine-shaft-100 mb-2">Responsibilities</div>
            <ul className="list-disc list-inside flex flex-col gap-1 text-mine-shaft-300">
              {responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        
        <aside className="flex flex-col gap-4 shrink-0">
          <div className="text-lg font-semibold text-mine-shaft-100">Recommended Jobs</div>
          {recommended.map(({ job: rec, i }) => (
            <JobCard key={i} id={i} {...rec} />
          ))}
        </aside>
      </div>
    </div>
  );
};


const Fact = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center text-center gap-1 bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl p-4">
    <div className="text-bright-sun-400">{icon}</div>
    <div className="text-xs text-mine-shaft-400">{label}</div>
    <div className="text-mine-shaft-100 font-medium">{value}</div>
  </div>
);

export default JobDescPage;
