import {
  IconChefHatFilled,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { footerLinks } from "../Data/Data";

const Footer = () => {
  return (
    <div className="mt-20 pb-5 flex gap-5 justify-around">
      <div className="w-1/4 flex flex-col gap-4">
        <div className="flex gap-1 items-center text-bright-sun-400">
          <IconChefHatFilled className="h-6 w-6" stroke={2.5} />
          <div className="text-xl font-semibold">HireSense</div>
        </div>
        <div className="text-sm text-mine-shaft-300">
          Job portal with user profiles, skill updates, certifications, work
          experience and admin job postings.
        </div>
        <div className="flex gap-3 [&>div]:bg-mine-shaft-800 [&>div]:p-3 [&>div]:rounded-full [&>div]:cursor-pointer [&>div]:transition-all duration-300 hover:[&>div]:scale-110">
          <div className="text-[#1877F2] hover:bg-mine-shaft-700">
            <IconBrandFacebook stroke={1.5} size={28} />
          </div>
          <div className="text-[#E4405F] hover:bg-mine-shaft-700">
            <IconBrandInstagram stroke={1.5} size={28} />
          </div>
          <div className="text-white hover:bg-mine-shaft-700">
            <IconBrandX stroke={1.5} size={28} />
          </div>
        </div>
      </div>

      {footerLinks.map((item, index) => (
        <div key={index}>
          <div className="text-lg font-semibold mb-4 text-bright-sun-400">
            {item.title}
          </div>
          {item.link.map((link: string, index: number) => (
            <div
              key={index}
              className="text-mine-shaft-300 text-sm hover:text-bright-sun-400 cursor-pointer mb-1 hover:translate-x-2 transition-all duration-300"
            >
              {link}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Footer;
