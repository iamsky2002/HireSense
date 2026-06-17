import {
  IconTargetArrow,
  IconClick,
  IconUsersGroup,
  IconShieldLock,
} from "@tabler/icons-react";

// honest value props (no fake testimonials) - each maps to something the app actually does
const features = [
  {
    icon: IconTargetArrow,
    title: "Skill-based matching",
    desc: "Jobs and candidates are connected on real skills, not just keyword luck.",
  },
  {
    icon: IconClick,
    title: "One-click apply & track",
    desc: "Apply in a single click and follow every application from applied to hired.",
  },
  {
    icon: IconUsersGroup,
    title: "Built for both sides",
    desc: "Separate, role-based experiences for candidates and employers.",
  },
  {
    icon: IconShieldLock,
    title: "Secure by design",
    desc: "JWT auth with role-based access control on a Java + Spring Boot backend.",
  },
];

const Features = () => {
  return (
    <div className="mt-20 pb-5 px-16">
      <div className="text-4xl text-center font-semibold mb-3 text-mine-shaft-100">
        Why <span className="text-bright-sun-400">HireSense</span>?
      </div>
      <div className="text-lg mx-auto text-mine-shaft-300 text-center w-1/2 mb-12">
        A focused recruitment platform where everything you see is wired to a
        real backend.
      </div>
      <div className="flex justify-center gap-5 flex-wrap">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 w-[22%] min-w-[230px] bg-mine-shaft-800/60 border border-mine-shaft-700 hover:border-bright-sun-400/50 hover:-translate-y-1 p-5 rounded-xl transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-bright-sun-500/15 flex items-center justify-center text-bright-sun-400">
              <f.icon size={26} />
            </div>
            <div className="text-lg text-mine-shaft-100 font-semibold">
              {f.title}
            </div>
            <div className="text-sm text-mine-shaft-300">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Features;
