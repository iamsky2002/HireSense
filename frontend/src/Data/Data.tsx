// Mock data for the app (companies, job categories, etc)
// TODO: Replace with real API data later

// TypeScript interfaces — these tell the compiler the exact shape of each data object
interface JobCategory {
  name: string;
  desc: string;
  jobs: string;
}
interface WorkStep {
  name: string;
  desc: string;
}
interface Testimonial {
  name: string;
  testimonial: string;
  rating: number;
  avatar: string;
}
interface FooterLink {
  title: string;
  link: string[];
}

export const companies: string[] = [
  "Google",
  "Amazon",
  "Figma",
  "Netflix",
  "Meta",
  "Microsoft",
  "Pinterest",
  "Slack",
  "Spotify",
  "Oracle",
  "Walmart",
];

export const jobCategory = [
  {
    name: "Digital Marketing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, numquam?",
    jobs: "1k",
  },
  {
    name: "Web Developer",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, numquam?",
    jobs: "2k",
  },
  {
    name: "Arts & Design",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, numquam?",
    jobs: "1.5k",
  },
  {
    name: "Data Entry",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, numquam?",
    jobs: "3k",
  },
  {
    name: "UI-UX Designer",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, numquam?",
    jobs: "800",
  },
  {
    name: "Content Writing",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, numquam?",
    jobs: "1.2k",
  },
];

export const work = [
  {
    name: "Design Your Resume",
    desc: "Create an ATS-friendly professional resume that highlights your skills and experience.",
  },
  {
    name: "Apply for Job",
    desc: "Discover and apply to opportunities that match your profile and skills.",
  },
  {
    name: "Land Your Dream Job",
    desc: "Connect directly with top recruiters and employers and start your career journey today.",
  },
];

export const testimonials = [
  {
    name: "Ritesh Chauhan",
    testimonial:
      "Job searching became much easier with this platform. The interface is simple, fast, and very user-friendly.",
    rating: 4.5,
    avatar: "avatar-1.png",
  },
  {
    name: "Prashant Yadav",
    testimonial:
      "I was able to connect with recruiters quickly and received interview opportunities within days.",
    rating: 3.5,
    avatar: "avatar-2.png",
  },
  {
    name: "Buddha Kishor",
    testimonial:
      "A well-organized job portal with genuine openings and a smooth application experience.",
    rating: 4,
    avatar: "avatar-3.png",
  },
  {
    name: "Anshika Gupta",
    testimonial:
      "The platform provides excellent job recommendations and made my career search more efficient.",
    rating: 4.5,
    avatar: "avatar-4.png",
  },
];

export const footerLinks = [
  { title: "Product", link: ["Find Job", "Find Company", "Find Employee"] },
  {
    title: "Company",
    link: ["About Us", "Contact Us", "Privacy Policy", "Terms & Conditions"],
  },
  { title: "Support", link: ["Help & Support", "Feedback", "FAQs"] },
];
