import { useState } from "react";
import { Button, Menu, Avatar, Burger, Drawer } from "@mantine/core";
import { IconChefHatFilled, IconLogout, IconBrandGithub } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLink";
import { useAuth } from "../auth/AuthContext";

const GITHUB_URL = "https://github.com/iamsky2002/HireSense";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const close = () => setDrawer(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    close();
  };

  return (
    <div className="w-full bg-mine-shaft-900 px-4 sm:px-6 text-white h-20 flex justify-between items-center">
      <Link to="/" className="flex gap-2 items-center text-bright-sun-300" onClick={close}>
        <IconChefHatFilled className="h-8 w-9" stroke={1.25} />
        <div className="text-2xl sm:text-3xl">HireSense</div>
      </Link>

      {/* desktop nav */}
      <div className="hidden md:flex h-full">
        <NavLinks role={user?.role} />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          title="View source on GitHub"
          className="hidden sm:block text-mine-shaft-300 hover:text-bright-sun-400 transition-colors"
        >
          <IconBrandGithub size={26} />
        </a>

        {user ? (
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="hidden sm:inline text-mine-shaft-100">{user.fullName}</span>
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
          <Link to="/login" className="hidden md:block">
            <Button color="brightSun.4" autoContrast>
              Login
            </Button>
          </Link>
        )}

        {/* mobile: hamburger opens the nav drawer */}
        <Burger
          opened={drawer}
          onClick={() => setDrawer((o) => !o)}
          className="md:hidden"
          color="#e2e8f0"
          size="sm"
          aria-label="Toggle menu"
        />
      </div>

      <Drawer
        opened={drawer}
        onClose={close}
        position="right"
        size="75%"
        title="Menu"
        classNames={{ content: "bg-mine-shaft-900", header: "bg-mine-shaft-900", title: "text-bright-sun-400 font-semibold" }}
      >
        <NavLinks role={user?.role} vertical onNavigate={close} />

        <div className="flex flex-col gap-3 mt-6">
          {user ? (
            <Button color="red" variant="light" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login" onClick={close}>
              <Button color="brightSun.4" autoContrast fullWidth>
                Login
              </Button>
            </Link>
          )}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="flex items-center gap-2 text-mine-shaft-300 hover:text-bright-sun-400"
          >
            <IconBrandGithub size={20} /> Source on GitHub
          </a>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
