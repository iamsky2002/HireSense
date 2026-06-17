import { JobResponse } from "../api/jobs";

// turns a backend enum value ("FULL_TIME") into a display label
const typeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};

export function jobTypeLabel(type: string | null): string {
  if (!type) return "";
  return typeLabels[type] || type;
}

// how many days ago postedAt (ISO timestamp) was
export function daysAgo(iso: string): number {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return days < 0 ? 0 : days;
}

// formats salaryMin/Max into a readable string
export function salaryText(min: number | null, max: number | null): string {
  if (min != null && max != null) return `${min}-${max} LPA`;
  if (max != null) return `${max} LPA`;
  if (min != null) return `${min}+ LPA`;
  return "Not disclosed";
}

// maps a JobResponse to JobCard props (used by both Find Jobs and Recommended)
export function toCardProps(job: JobResponse) {
  return {
    id: job.id,
    jobTitle: job.title,
    company: job.company,
    applicants: 0, // backend doesn't return an applicant count yet
    experience: job.experience || "",
    jobType: jobTypeLabel(job.type),
    location: job.location || "",
    package: salaryText(job.salaryMin, job.salaryMax),
    postedDaysAgo: daysAgo(job.postedAt),
    description: job.description,
  };
}
