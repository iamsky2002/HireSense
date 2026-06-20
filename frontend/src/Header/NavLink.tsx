import { Link, useLocation } from "react-router-dom";
import { Role } from "../api/auth";

// nav links are filtered by role
const NavLinks = ({ role }: { role?: Role }) => {
  const allLinks = [
    { name: "Dashboard", url: "/dashboard", roles: ["CANDIDATE"] as Role[] },
    { name: "Dashboard", url: "/employer-dashboard", roles: ["EMPLOYER"] as Role[] },
    { name: "Dashboard", url: "/admin", roles: ["ADMIN"] as Role[] },
    { name: "Find Jobs", url: "/find-jobs", roles: ["CANDIDATE", "ADMIN"] as Role[], showLoggedOut: true },
    { name: "Find Talent", url: "/find-talent", roles: ["EMPLOYER", "ADMIN"] as Role[], showLoggedOut: true },
    { name: "Post Job", url: "/post-job", roles: ["EMPLOYER"] as Role[] },
    { name: "Posted Jobs", url: "/posted-jobs", roles: ["EMPLOYER"] as Role[] },
    { name: "Job History", url: "/job-history", roles: ["CANDIDATE"] as Role[] },
    { name: "My Profile", url: "/my-profile", roles: ["CANDIDATE"] as Role[] },
  ];

  // logged in: links for the role; logged out: only the browse ones
  const links = allLinks.filter((l) => (role ? l.roles.includes(role) : l.showLoggedOut));

  const location = useLocation();
  return (
    <div className="flex gap-5 text-mine-shaft-300 h-full items-center">
      {links.map((link, index) => (
        <div
          key={index}
          className={`${location.pathname === link.url
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
