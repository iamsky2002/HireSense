import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

// honest closing CTA (replaces the dead newsletter form) - both buttons actually go somewhere
const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-20 mb-12 mx-4 sm:mx-8 lg:mx-20 bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-950 border border-bright-sun-400/20 rounded-2xl py-12 px-6 sm:px-10 flex flex-col items-center text-center gap-4 shadow-xl shadow-black/30">
      <div className="text-4xl font-semibold text-mine-shaft-100">
        Ready to find your <span className="text-bright-sun-400">next role</span>?
      </div>
      <div className="text-mine-shaft-300 max-w-xl">
        Browse live jobs, or create an account to apply and track everything in
        one place.
      </div>
      <div className="flex gap-3 mt-2">
        <Button
          size="md"
          radius="md"
          color="bright-sun.5"
          onClick={() => navigate("/find-jobs")}
        >
          Find Jobs
        </Button>
        <Button
          size="md"
          radius="md"
          variant="outline"
          color="bright-sun.4"
          onClick={() => navigate("/register")}
        >
          Create account
        </Button>
      </div>
    </div>
  );
};
export default CallToAction;
