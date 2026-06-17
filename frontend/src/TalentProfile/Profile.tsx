import { Button, Divider } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconCalendar, IconCoin } from "@tabler/icons-react";
import { profile } from "../Data/TalentData";
import ExpCard from "./ExpCard";
import CertiCard from "./CertifiCard";

const Profile = (props: any) => {
  // Use passed props, fallback to imported profile data
  const {
    name = profile.name,
    role = profile.role,
    company = profile.company,
    location = profile.location,
    about = profile.about,
    skills = profile.skills,
    experience = profile.experience,
    certifications = profile.certifications,
    image = "avatar-1",
    // expected ctc with fallback
    expectedCtc = "₹48 - 60LPA"
  } = props;

  return (
    <div className="w-2/3">
      <div className="relative">
        <img
          src="/Profile/banner.jpg"
          alt="Profile Banner"
          className="rounded-t-3xl w-full h-48 object-cover"
        />
        <img
          src={`/${image}.png`}
          alt="Avatar"
          className="absolute -bottom-1/3 left-6 size-40 rounded-full border-8 border-mine-shaft-950"
        />
      </div>

      <div className="px-6 pt-16 pb-6 bg-mine-shaft-950 rounded-b-3xl flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-mine-shaft-100">
            {name}
          </h1>
          <Button color="bright-sun.4" variant="light">
            Message
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-mine-shaft-200 text-sm font-medium tracking-wide">
            <div className="p-1.5 bg-mine-shaft-800 rounded-full text-blue-400 flex items-center justify-center">
              <IconBriefcase className="h-4 w-4" stroke={2} />
            </div>
            <span>{role} &bull; {company}</span>
          </div>

          <div className="flex items-center gap-3 text-mine-shaft-200 text-sm font-medium tracking-wide">
            <div className="p-1.5 bg-mine-shaft-800 rounded-full text-red-500 flex items-center justify-center">
              <IconMapPin className="h-4 w-4" stroke={2} />
            </div>
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-3 text-mine-shaft-200 text-sm font-medium tracking-wide">
            <div className="p-1.5 bg-mine-shaft-800 rounded-full text-green-400 flex items-center justify-center">
              <IconCalendar className="h-4 w-4" stroke={2} />
            </div>
            <span>Experience: 3 Years</span>
          </div>

          <div className="flex items-center gap-3 text-mine-shaft-200 text-sm font-medium tracking-wide">
            <div className="p-1.5 bg-mine-shaft-800 rounded-full text-yellow-500 flex items-center justify-center">
              <IconCoin className="h-4 w-4" stroke={2} />
            </div>
            <span>Expected CTC: {expectedCtc}</span>
          </div>
        </div>

        <Divider color="mine-shaft.7" size="xs" />

        <div>
          <h2 className="text-2xl font-semibold text-mine-shaft-100 mb-3">About</h2>
          <p className="text-sm text-mine-shaft-300 text-justify leading-relaxed">
            {about}
          </p>
        </div>

        <Divider color="mine-shaft.7" size="xs" />

        <div>
          <h2 className="text-2xl font-semibold text-mine-shaft-100 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-mine-shaft-800 text-bright-sun-400 text-xs font-semibold rounded-3xl"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <Divider color="mine-shaft.7" size="xs" />

        <div>
          <h2 className="text-2xl font-semibold text-mine-shaft-100 mb-4">Experience</h2>
          <div className="flex flex-col gap-6">
            {experience.map((exp: any, index: number) => (
              <ExpCard key={index} {...exp} />
            ))}
          </div>
        </div>

        <Divider color="mine-shaft.7" size="xs" />

        <div>
          <h2 className="text-2xl font-semibold text-mine-shaft-100 mb-4">Certifications</h2>
          <div className="flex flex-col gap-6">
            {certifications.map((cert: any, index: number) => (
              <CertiCard key={index} {...cert} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
