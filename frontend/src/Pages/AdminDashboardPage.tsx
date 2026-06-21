import { useEffect, useState } from "react";
import { Table, Switch, Badge, TextInput, Select } from "@mantine/core";
import { IconUsers, IconUser, IconBuilding, IconBriefcase, IconFileText, IconSearch } from "@tabler/icons-react";
import { useAuth } from "../auth/AuthContext";
import { Role } from "../api/auth";
import { getAdminStats, getAdminUsers, setUserEnabled, AdminStats, AdminUser } from "../api/admin";

const roleColor: Record<Role, string> = {
  CANDIDATE: "blue",
  EMPLOYER: "grape",
  ADMIN: "brightSun",
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    let active = true;
    Promise.all([getAdminStats().catch(() => null), getAdminUsers().catch(() => [] as AdminUser[])]).then(
      ([s, u]) => {
        if (!active) return;
        setStats(s);
        setUsers(u);
        setLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const toggle = async (u: AdminUser) => {
    try {
      const updated = await setUserEnabled(u.id, !u.enabled);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <div className="p-8 text-mine-shaft-300 min-h-[90vh]">Loading admin dashboard...</div>;
  }

  const cards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: IconUsers, color: "text-bright-sun-400" },
        { label: "Candidates", value: stats.candidates, icon: IconUser, color: "text-blue-400" },
        { label: "Employers", value: stats.employers, icon: IconBuilding, color: "text-violet-400" },
        { label: "Jobs", value: stats.totalJobs, icon: IconBriefcase, color: "text-cyan-400" },
        { label: "Applications", value: stats.totalApplications, icon: IconFileText, color: "text-green-400" },
      ]
    : [];

  const q = search.trim().toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      (roleFilter === "ALL" || u.role === roleFilter) &&
      (q === "" || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  );

  return (
    <div className="p-4 md:p-8 min-h-[90vh] flex flex-col gap-6">
      <div>
        <div className="text-2xl font-semibold text-mine-shaft-100">
          Admin <span className="text-bright-sun-400">Dashboard</span> 🛡️
        </div>
        <div className="text-sm text-mine-shaft-400">Platform overview and user management.</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-5 flex items-center gap-3"
            >
              <div className={`p-3 rounded-lg bg-mine-shaft-800 ${c.color}`}>
                <Icon size={24} stroke={1.5} />
              </div>
              <div>
                <div className="text-2xl font-bold text-mine-shaft-100">{c.value}</div>
                <div className="text-xs text-mine-shaft-400">{c.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-lg font-semibold text-mine-shaft-100">
            Users ({filteredUsers.length}
            {filteredUsers.length !== users.length ? ` of ${users.length}` : ""})
          </div>
          <div className="flex gap-2 flex-wrap">
            <TextInput
              size="xs"
              placeholder="Search name or email"
              leftSection={<IconSearch size={14} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="w-56"
            />
            <Select
              size="xs"
              data={[
                { value: "ALL", label: "All roles" },
                { value: "CANDIDATE", label: "Candidates" },
                { value: "EMPLOYER", label: "Employers" },
                { value: "ADMIN", label: "Admins" },
              ]}
              value={roleFilter}
              onChange={(val) => setRoleFilter(val || "ALL")}
              allowDeselect={false}
              className="w-36"
            />
          </div>
        </div>
        <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl overflow-x-auto">
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Active</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.map((u) => (
                <Table.Tr key={u.id}>
                  <Table.Td className="text-mine-shaft-100">{u.fullName}</Table.Td>
                  <Table.Td className="text-mine-shaft-300">{u.email}</Table.Td>
                  <Table.Td>
                    <Badge color={roleColor[u.role]} variant="light">
                      {u.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {u.enabled ? (
                      <span className="text-green-400 text-xs">Active</span>
                    ) : (
                      <span className="text-red-400 text-xs">Disabled</span>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Switch
                      checked={u.enabled}
                      color="brightSun.4"
                      disabled={u.id === user?.userId}
                      onChange={() => toggle(u)}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="p-6 text-center text-mine-shaft-400 text-sm">No users match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
