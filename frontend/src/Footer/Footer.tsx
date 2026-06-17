import {
  IconChefHatFilled,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandMedium,
  IconBrandX,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

// SKY's links. GitHub is live; drop in the real URLs for the rest when ready.
const social = {
  github: "https://github.com/iamsky2002",
  linkedin: "https://www.linkedin.com/", // TODO: SKY's profile
  medium: "https://medium.com/", // TODO: SKY's profile
  x: "https://x.com/", // TODO: SKY's profile
  instagram: "https://www.instagram.com/", // TODO: SKY's profile
};

// real, working links only (every item below actually goes somewhere)
const columns = [
  {
    title: "Explore",
    links: [
      { label: "Find Jobs", to: "/find-jobs" },
      { label: "Find Talent", to: "/find-talent" },
      { label: "Post a Job", to: "/post-job" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Create account", to: "/register" },
    ],
  },
];

const Footer = () => {
  return (
    <div className="border-t border-mine-shaft-800 mt-10">
      <div className="pt-12 pb-6 flex gap-5 justify-between px-16">
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex gap-1 items-center text-bright-sun-400">
            <IconChefHatFilled className="h-6 w-6" stroke={2.5} />
            <div className="text-xl font-semibold">HireSense</div>
          </div>
          <div className="text-sm text-mine-shaft-300 max-w-sm">
            An intelligent recruitment platform - search and apply for jobs,
            manage applicants, and track every step in one place.
          </div>
          <div className="flex gap-3 [&>a]:bg-mine-shaft-800 [&>a]:p-3 [&>a]:rounded-full [&>a]:cursor-pointer [&>a]:transition-all duration-300 hover:[&>a]:scale-110">
            <a href={social.github} target="_blank" rel="noreferrer" className="text-mine-shaft-100 hover:bg-mine-shaft-700">
              <IconBrandGithub stroke={1.5} size={24} />
            </a>
            <a href={social.linkedin} target="_blank" rel="noreferrer" className="text-[#0A66C2] hover:bg-mine-shaft-700">
              <IconBrandLinkedin stroke={1.5} size={24} />
            </a>
            <a href={social.medium} target="_blank" rel="noreferrer" className="text-mine-shaft-100 hover:bg-mine-shaft-700">
              <IconBrandMedium stroke={1.5} size={24} />
            </a>
            <a href={social.x} target="_blank" rel="noreferrer" className="text-mine-shaft-100 hover:bg-mine-shaft-700">
              <IconBrandX stroke={1.5} size={24} />
            </a>
            <a href={social.instagram} target="_blank" rel="noreferrer" className="text-[#E4405F] hover:bg-mine-shaft-700">
              <IconBrandInstagram stroke={1.5} size={24} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-lg font-semibold mb-4 text-bright-sun-400">
              {col.title}
            </div>
            {col.links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="block text-mine-shaft-300 text-sm hover:text-bright-sun-400 cursor-pointer mb-2 hover:translate-x-1 transition-all duration-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <div>
          <div className="text-lg font-semibold mb-4 text-bright-sun-400">
            Project
          </div>
          <a href={social.github + "/HireSense"} target="_blank" rel="noreferrer" className="block text-mine-shaft-300 text-sm hover:text-bright-sun-400 mb-2 hover:translate-x-1 transition-all duration-300">
            Source code
          </a>
          <a href={social.github} target="_blank" rel="noreferrer" className="block text-mine-shaft-300 text-sm hover:text-bright-sun-400 mb-2 hover:translate-x-1 transition-all duration-300">
            Developer
          </a>
        </div>
      </div>

      {/* personal credit + stack */}
      <div className="border-t border-mine-shaft-800 py-4 px-16 flex flex-wrap justify-between items-center gap-2 text-sm text-mine-shaft-400">
        <div>
          Designed &amp; Developed by{" "}
          <a
            href={social.github}
            target="_blank"
            rel="noreferrer"
            className="text-mine-shaft-100 hover:text-bright-sun-400 font-medium"
          >
            Sumeet Kumar (SKY)
          </a>
        </div>
        <div>Java 21 · Spring Boot · React · TypeScript · MySQL</div>
      </div>
    </div>
  );
};
export default Footer;
