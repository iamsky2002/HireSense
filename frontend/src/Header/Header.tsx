import { Avatar, Indicator } from "@mantine/core";
import { IconChefHatFilled, IconBell, IconSettings } from "@tabler/icons-react";
import NavLinks from "./NavLink";

const Header = () => {
  return (
    <div
      className="w-full bg-mine-shaft-900 px-6  text-white  h-29   flex justify-between p-4 items-center
    "
    >
      <div className="flex gap-2 items-center text-bright-sun-300">
        <IconChefHatFilled className="h-9 w-10" stroke={1.25} />
        <div className="text-3xl">HireSense</div>
      </div>
      <NavLinks />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-4">
          <div>SKY</div>
          <Avatar src="avatar.png" alt="it's me" />
          <div className="bg-mine-shaft-800 p-2 rounded-full">
            <IconSettings strokeWidth={1.5} />
          </div>
          <div className="bg-mine-shaft-800 p-2 rounded-full">
            <Indicator color="bright-sun.4" offset={4} size={11} processing>
              <IconBell strokeWidth={1.5} />
            </Indicator>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
