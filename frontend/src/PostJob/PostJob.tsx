import { useState } from "react";
import { TextInput, Select, NumberInput, Textarea, TagsInput, Button, Grid } from "@mantine/core";
import { fields } from "../Data/PostJob";
import { createJob, EmploymentType } from "../api/jobs";

// friendly Job Type labels; value matches the backend EmploymentType enum
const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

// form for posting a new job (connected to the real API)
const PostJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState<number | string>("");
  const [salaryMax, setSalaryMax] = useState<number | string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handlePost = async () => {
    setMessage(null);

    // backend requires title, description and type, so check them here first
    if (!jobTitle.trim() || !jobDescription.trim() || !jobType) {
      setMessage({ ok: false, text: "Title, description and job type are required." });
      return;
    }

    try {
      setSubmitting(true);
      const created = await createJob({
        title: jobTitle.trim(),
        description: jobDescription.trim(),
        location: location || undefined,
        experience: experience || undefined,
        type: jobType as EmploymentType,
        salaryMin: salaryMin === "" ? undefined : Number(salaryMin),
        salaryMax: salaryMax === "" ? undefined : Number(salaryMax),
        skills,
      });

      setMessage({ ok: true, text: `Job posted successfully! (id: ${created.id})` });

      // clear the form after a successful post
      setJobTitle("");
      setExperience("");
      setJobType("");
      setLocation("");
      setSalaryMin("");
      setSalaryMax("");
      setSkills([]);
      setJobDescription("");
    } catch (err) {
      // 403 = candidate (only employers can post), otherwise a generic error
      const status = (err as any)?.response?.status;
      const text =
        status === 403
          ? "Only employers can post a job."
          : "Something went wrong. Please try again.";
      setMessage({ ok: false, text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-4/5 mx-auto mt-5 p-6 bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl">
      <div className="text-2xl font-bold text-mine-shaft-100 mb-6">Post a Job</div>
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
            label="Job Description"
            placeholder="Enter job details..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.currentTarget.value)}
            rows={8}
          />
        </Grid.Col>

        {message && (
          <Grid.Col span={12}>
            <div className={message.ok ? "text-green-400" : "text-red-400"}>
              {message.text}
            </div>
          </Grid.Col>
        )}

        <Grid.Col span={12} className="flex gap-4 mt-4">
          <Button color="bright-sun.4" onClick={handlePost} loading={submitting}>
            Post Job
          </Button>
          <Button variant="outline" color="bright-sun.4">
            Save Draft
          </Button>
        </Grid.Col>

      </Grid>
    </div>
  );
};

export default PostJob;
