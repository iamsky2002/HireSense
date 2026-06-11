import { Link, useLocation } from "react-router-dom";
import { Role } from "../api/auth";

// Nav links role ke hisaab se filter hote hain
const NavLinks = ({ role }: { role?: Role }) => {
  const allLinks = [
    { name: "Find Jobs", url: "/find-jobs", roles: ["CANDIDATE", "ADMIN"] as Role[], showLoggedOut: true },
    { name: "Find Talent", url: "/find-talent", roles: ["EMPLOYER", "ADMIN"] as Role[], showLoggedOut: true },
    { name: "Post Job", url: "/post-job", roles: ["EMPLOYER", "ADMIN"] as Role[] },
    { name: "Posted Jobs", url: "/posted-jobs", roles: ["EMPLOYER", "ADMIN"] as Role[] },
    { name: "Job History", url: "/job-history", roles: ["CANDIDATE", "ADMIN"] as Role[] },
  ];

  // Logged in -> role ke links; logged out -> sirf browse wale
  const links = allLinks.filter((l) => (role ? l.roles.includes(role) : l.showLoggedOut));

  const location = useLocation();
  return (
    <div className="flex gap-5 text-mine-shaft-300 h-full items-center">
      {links.map((link, index) => (
        <div
          key={index}
          className={`${
            location.pathname === link.url
              ? "border-bright-sun-400 text-bright-sun-400"
              : "border-transparent"
          } border-t-[3px] h-full flex items-center`}
        >
          <Link to={link.url}>{link.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default NavLinks;
