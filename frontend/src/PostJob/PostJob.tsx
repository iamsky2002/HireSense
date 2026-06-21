import { useEffect, useState } from "react";
import { TextInput, Select, NumberInput, Textarea, TagsInput, Button, Grid } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { fields } from "../Data/PostJob";
import { createJob, updateJob, getJob, EmploymentType } from "../api/jobs";
import { combineSections, descriptionToSections } from "../Data/jobSections";

// friendly Job Type labels; value matches the backend EmploymentType enum
const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

// post a new job, or edit an existing one when jobId is passed
const PostJob = ({ jobId }: { jobId?: number }) => {
  const isEdit = jobId != null;
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState<number | string>("");
  const [salaryMax, setSalaryMax] = useState<number | string>("");
  const [skills, setSkills] = useState<string[]>([]);
  // description is filled as three sections, joined into one string on submit
  const [about, setAbout] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // edit mode: load the job and pre-fill the form
  useEffect(() => {
    if (jobId == null) return;
    getJob(jobId)
      .then((job) => {
        setJobTitle(job.title);
        setExperience(job.experience || "");
        setJobType(job.type || "");
        setLocation(job.location || "");
        setSalaryMin(job.salaryMin ?? "");
        setSalaryMax(job.salaryMax ?? "");
        setSkills(job.skills);
        const secs = descriptionToSections(job.description);
        setAbout(secs.about);
        setResponsibilities(secs.responsibilities);
        setQualifications(secs.qualifications);
      })
      .catch(() => setMessage({ ok: false, text: "Couldn't load this job." }));
  }, [jobId]);

  const handleSubmit = async () => {
    setMessage(null);

    // backend requires title, description and type, so check them here first
    if (!jobTitle.trim() || !about.trim() || !jobType) {
      setMessage({ ok: false, text: "Title, About The Job and job type are required." });
      return;
    }

    const payload = {
      title: jobTitle.trim(),
      description: combineSections({ about, responsibilities, qualifications }),
      location: location || undefined,
      experience: experience || undefined,
      type: jobType as EmploymentType,
      salaryMin: salaryMin === "" ? undefined : Number(salaryMin),
      salaryMax: salaryMax === "" ? undefined : Number(salaryMax),
      skills,
    };

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateJob(jobId, payload);
        navigate("/posted-jobs");
      } else {
        const created = await createJob(payload);
        setMessage({ ok: true, text: `Job posted successfully! (id: ${created.id})` });
        // clear the form after a successful post
        setJobTitle("");
        setExperience("");
        setJobType("");
        setLocation("");
        setSalaryMin("");
        setSalaryMax("");
        setSkills([]);
        setAbout("");
        setResponsibilities("");
        setQualifications("");
      }
    } catch (err) {
      // 403 = candidate / not the owner, otherwise a generic error
      const status = (err as any)?.response?.status;
      const text =
        status === 403
          ? "You can only manage your own jobs."
          : "Something went wrong. Please try again.";
      setMessage({ ok: false, text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-4/5 mx-auto mt-5 p-6 bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl">
      <div className="text-2xl font-bold text-mine-shaft-100 mb-6">
        {isEdit ? "Edit Job" : "Post a Job"}
      </div>
      <Grid>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Job Title"
            placeholder="e.g. Backend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.currentTarget.value)}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Experience"
            placeholder="Select experience level"
            data={fields[2].options}
            value={experience}
            onChange={(val) => setExperience(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Job Type"
            placeholder="Select job type"
            data={jobTypeOptions}
            value={jobType}
            onChange={(val) => setJobType(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Location"
            placeholder="Select location"
            data={fields[4].options}
            value={location}
            onChange={(val) => setLocation(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Salary Min (LPA)"
            placeholder="e.g. 8"
            min={0}
            value={salaryMin}
            onChange={setSalaryMin}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Salary Max (LPA)"
            placeholder="e.g. 14"
            min={0}
            value={salaryMax}
            onChange={setSalaryMax}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <TagsInput
            label="Skills Required"
            placeholder="Add skills"
            value={skills}
            onChange={setSkills}
            clearable
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="About The Job"
            placeholder="What the role is about, the team, the mission..."
            value={about}
            onChange={(e) => setAbout(e.currentTarget.value)}
            rows={5}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="Responsibilities"
            placeholder="Day-to-day work, what they'll own (one per line)..."
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.currentTarget.value)}
            rows={5}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            label="Qualifications & Skill Sets"
            placeholder="Must-haves, nice-to-haves, experience..."
            value={qualifications}
            onChange={(e) => setQualifications(e.currentTarget.value)}
            rows={5}
          />
        </Grid.Col>

        {message && (
          <Grid.Col span={12}>
            <div className={message.ok ? "text-green-400" : "text-red-400"}>
              {message.text}
            </div>
          </Grid.Col>
        )}

        <Grid.Col span={12} className="mt-4">
          <Button color="bright-sun.4" onClick={handleSubmit} loading={submitting}>
            {isEdit ? "Update Job" : "Post Job"}
          </Button>
        </Grid.Col>

      </Grid>
    </div>
  );
};

export default PostJob;
