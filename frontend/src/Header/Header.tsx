import { Button, Menu, Avatar } from "@mantine/core";
import { IconChefHatFilled, IconLogout, IconBrandGithub } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLink";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full bg-mine-shaft-900 px-6 text-white h-29 flex justify-between p-4 items-center">
      <Link to="/" className="flex gap-2 items-center text-bright-sun-300">
        <IconChefHatFilled className="h-9 w-10" stroke={1.25} />
        <div className="text-3xl">HireSense</div>
      </Link>

      <NavLinks role={user?.role} />

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/iamsky2002/HireSense"
          target="_blank"
          rel="noreferrer"
          title="View source on GitHub"
          className="text-mine-shaft-300 hover:text-bright-sun-400 transition-colors"
        >
          <IconBrandGithub size={26} />
        </a>

        {user ? (
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-mine-shaft-100">{user.fullName}</span>
                <Avatar color="brightSun.4" radius="xl">
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconLogout size={16} />} color="red" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Link to="/login">
            <Button color="brightSun.4" autoContrast>
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
