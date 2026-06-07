import { useState } from "react";
import { Select, Textarea, TagsInput, Button, Grid } from "@mantine/core";
import { fields, content } from "../Data/PostJob";

// Form component for posting new jobs
const PostJob = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState(content);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const handlePost = () => {
    console.log("Form data:", {
      jobTitle,
      company,
      experience,
      jobType,
      location,
      salary,
      skills,
      jobDescription,
    });
  };

  return (
    <div className="w-4/5 mx-auto mt-5 p-6 bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl">
      <div className="text-2xl font-bold text-mine-shaft-100 mb-6">Post a Job</div>
      <Grid>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Job Title"
            placeholder="Enter Job Title"
            data={fields[0].options}
            value={jobTitle}
            onChange={(val) => setJobTitle(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Company"
            placeholder="Enter Company Name"
            data={fields[1].options}
            value={company}
            onChange={(val) => setCompany(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Experience"
            placeholder="Enter Experience Level"
            data={fields[2].options}
            value={experience}
            onChange={(val) => setExperience(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Job Type"
            placeholder="Enter Job Type"
            data={fields[3].options}
            value={jobType}
            onChange={(val) => setJobType(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Location"
            placeholder="Enter Job Location"
            data={fields[4].options}
            value={location}
            onChange={(val) => setLocation(val || "")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Salary"
            placeholder="Enter Salary"
            data={fields[5].options}
            value={salary}
            onChange={(val) => setSalary(val || "")}
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

        <Grid.Col span={12} className="flex gap-4 mt-4">
          <Button color="bright-sun.4" onClick={handlePost}>
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
