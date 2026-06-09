import { Button } from "@mantine/core";
import { IconChefHatFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLink";

const Header = () => {
  return (
    <div className="w-full bg-mine-shaft-900 px-6 text-white h-29 flex justify-between p-4 items-center">
      
      <Link to="/" className="flex gap-2 items-center text-bright-sun-300">
        <IconChefHatFilled className="h-9 w-10" stroke={1.25} />
        <div className="text-3xl">HireSense</div>
      </Link>

      <NavLinks />

      
      <Link to="/login">
        <Button color="brightSun.4" autoContrast>
          Login
        </Button>
      </Link>
    </div>
  );
};

export default Header;
