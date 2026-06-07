import { IconBriefcase, IconMapPin, IconRecharging, IconSearch } from "@tabler/icons-react";

const dropdownData = [
    { title: "Job Title", icon: IconSearch, options: ['Designer', 'Developer', 'Product Manager', 'Marketing Specialist', 'Data Analyst', 'Sales Executive', 'Content Writer', 'Customer Support'] },
    { title: "Location", icon: IconMapPin, options: ['Delhi', 'New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto'] },
    { title: "Experience", icon: IconBriefcase, options: ['Entry Level', 'Intermediate', 'Expert'] },
    { title: "Job Type", icon: IconRecharging, options: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'] }
];

const searchFields = [
    { title: "Skills", icon: IconSearch, options: ['React', 'Python', 'Java', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Figma'] },
    { title: "Experience", icon: IconBriefcase, options: ['0-1 Years', '1-3 Years', '3-5 Years', '5-8 Years', '8+ Years'] },
    { title: "Location", icon: IconMapPin, options: ['Delhi', 'Bangalore', 'Mumbai', 'Remote', 'New York', 'San Francisco', 'London', 'Toronto'] },
    { title: "Job Type", icon: IconRecharging, options: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'] }
];

const jobList = [
    {
      jobTitle: "Software Engineer, AR/VR",
      company: "Meta",
      applicants: 120,
      experience: "Expert",
      jobType: "Full Time",
      location: "Menlo Park",
      package: "45 LPA",
      postedDaysAgo: 2,
      description: "Join Reality Labs to build the future of immersive interfaces. You'll architect high-performance C++ systems for the next generation of VR headsets, ensuring a seamless metaverse experience with ultra-low latency."
    },
    {
      jobTitle: "Machine Learning Engineer",
      company: "Netflix",
      applicants: 85,
      experience: "Intermediate",
      jobType: "Full Time",
      location: "Los Gatos",
      package: "38 LPA",
      postedDaysAgo: 5,
      description: "Help shape what millions watch every day. You'll develop scalable ML pipelines to refine our recommendation algorithms, driving viewer engagement through deeply personalized content delivery."
    },
    {
      jobTitle: "Cloud Solutions Architect",
      company: "Microsoft",
      applicants: 42,
      experience: "Expert",
      jobType: "Remote",
      location: "Seattle",
      package: "40 LPA",
      postedDaysAgo: 4,
      description: "Lead the technical vision for enterprise clients migrating to Azure. You will design resilient, scalable cloud architectures, specializing in Kubernetes and distributed microservices for global platforms."
    },
    {
      jobTitle: "Principal UX Researcher",
      company: "Adobe",
      applicants: 60,
      experience: "Expert",
      jobType: "Full Time",
      location: "San Jose",
      package: "35 LPA",
      postedDaysAgo: 12,
      description: "Drive the creative suite's future by leading generative AI usability studies. Collaborate directly with design leaders to synthesize quantitative and qualitative data into actionable, user-centric product features."
    },
    {
      jobTitle: "Data Scientist, Search",
      company: "Google",
      applicants: 200,
      experience: "Intermediate",
      jobType: "Full Time",
      location: "Mountain View",
      package: "39 LPA",
      postedDaysAgo: 1,
      description: "Dive into the world's largest datasets. You will apply advanced statistical modeling and natural language processing techniques to improve the relevance, speed, and accuracy of Google Search results globally."
    },
    {
      jobTitle: "iOS Mobile Architect",
      company: "Spotify",
      applicants: 45,
      experience: "Expert",
      jobType: "Full Time",
      location: "Stockholm",
      package: "42 LPA",
      postedDaysAgo: 8,
      description: "Architect robust, scalable iOS solutions for the world's leading audio platform. You will focus on audio playback optimization, memory management, and crafting buttery-smooth UI interactions in Swift."
    },
    {
      jobTitle: "Technical Program Manager",
      company: "Amazon",
      applicants: 90,
      experience: "Expert",
      jobType: "Full Time",
      location: "Austin",
      package: "48 LPA",
      postedDaysAgo: 10,
      description: "Lead cross-functional engineering teams to launch massive supply chain innovations. You'll own the end-to-end delivery of complex fulfillment systems, managing risks and scaling logistics operations globally."
    },
    {
      jobTitle: "Graphics Programmer",
      company: "Apple",
      applicants: 34,
      experience: "Intermediate",
      jobType: "Full Time",
      location: "Cupertino",
      package: "36 LPA",
      postedDaysAgo: 7,
      description: "Push the boundaries of Apple Silicon. You will optimize the Metal graphics framework, ensuring game developers and professional creators can maximize GPU performance across both macOS and iOS devices."
    }
  ];

  export {dropdownData, searchFields, jobList};