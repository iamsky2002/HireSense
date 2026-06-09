import { useState } from "react";
import { TextInput, PasswordInput, Button, SegmentedControl } from "@mantine/core";
import { IconChefHatFilled, IconAt, IconLock, IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";


const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [errors, setErrors] = useState<Record<string, string>>({});

  
  const handleSignup = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    
    console.log("Signup data:", { name, email, password, role });
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 py-8 bg-mine-shaft-950">
      <div className="w-full max-w-[460px] bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-8 flex flex-col gap-4">
        
        <Link to="/" className="flex items-center justify-center gap-2 text-bright-sun-300">
          <IconChefHatFilled className="h-8 w-9" stroke={1.25} />
          <span className="text-2xl font-semibold">HireSense</span>
        </Link>

        <div className="text-center">
          <div className="text-xl font-semibold text-mine-shaft-100">Create your account</div>
          <div className="text-sm text-mine-shaft-300">Join HireSense to find jobs or hire talent</div>
        </div>

        <TextInput
          label="Full Name"
          withAsterisk
          placeholder="Your name"
          leftSection={<IconUser size={18} />}
          value={name}
          error={errors.name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <TextInput
          label="Email"
          withAsterisk
          placeholder="your@email.com"
          leftSection={<IconAt size={18} />}
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <PasswordInput
          label="Password"
          withAsterisk
          placeholder="Create a password"
          leftSection={<IconLock size={18} />}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <PasswordInput
          label="Confirm Password"
          withAsterisk
          placeholder="Re-enter password"
          leftSection={<IconLock size={18} />}
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
        />

        
        <div>
          <div className="text-sm font-medium text-mine-shaft-100 mb-1">I am a</div>
          <SegmentedControl
            fullWidth
            color="brightSun.4"
            value={role}
            onChange={setRole}
            data={[
              { label: "Candidate", value: "CANDIDATE" },
              { label: "Employer", value: "EMPLOYER" },
            ]}
          />
        </div>

        <Button color="brightSun.4" autoContrast onClick={handleSignup} fullWidth>
          Sign up
        </Button>

        <div className="text-sm text-center text-mine-shaft-300">
          Already have an account?{" "}
          <Link to="/login" className="text-bright-sun-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
