import { useState } from "react";
import { TextInput, PasswordInput, Button, Alert } from "@mantine/core";
import { IconChefHatFilled, IconAt, IconLock } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setServerError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      // Role ke hisaab se bhejo
      navigate(user.role === "EMPLOYER" ? "/posted-jobs" : "/find-jobs");
    } catch (err) {
      setServerError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 bg-mine-shaft-950">
      <div className="w-full max-w-[420px] bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-8 flex flex-col gap-5">
        <Link to="/" className="flex items-center justify-center gap-2 text-bright-sun-300">
          <IconChefHatFilled className="h-8 w-9" stroke={1.25} />
          <span className="text-2xl font-semibold">HireSense</span>
        </Link>

        <div className="text-center">
          <div className="text-xl font-semibold text-mine-shaft-100">Welcome back</div>
          <div className="text-sm text-mine-shaft-300">Login to your account</div>
        </div>

        {serverError && <Alert color="red" variant="light">{serverError}</Alert>}

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
          placeholder="Your password"
          leftSection={<IconLock size={18} />}
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <Button color="brightSun.4" autoContrast onClick={handleLogin} loading={loading} fullWidth>
          Login
        </Button>

        <div className="text-sm text-center text-mine-shaft-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-bright-sun-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
