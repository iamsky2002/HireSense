import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { IconMail, IconArrowRight, IconCheck } from "@tabler/icons-react";

const Subscribe = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <div className="mt-20 flex items-center bg-mine-shaft-800 mx-20 py-3 rounded-xl justify-around transition-all duration-300 hover:shadow-[0_0_15px_1px_rgba(255,189,32,0.15)] hover:bg-mine-shaft-800/90">
      <div className="text-4xl w-2/5 text-center font-semibold text-mine-shaft-100">
        Stay Ahead With the Latest{" "}
        <span className="text-bright-sun-400">Job Alerts</span>
      </div>
      <div className="flex gap-4 rounded-xl bg-mine-shaft-700 px-3 py-2 items-center focus-within:ring-2 focus-within:ring-bright-sun-400 transition-all duration-300">
        <TextInput
          className="[&_input]:text-mine-shaft-100 font-semibold"
          variant="unstyled"
          placeholder="Drop your email here..."
          size="xl"
          leftSection={<IconMail size={24} className="text-mine-shaft-300" />}
        />
        <Button
          className="!rounded-lg hover:scale-105 transition-all ease-in-out"
          size="lg"
          color={subscribed ? "green" : "bright-sun.4"}
          variant="filled"
          onClick={handleSubscribe}
          rightSection={
            subscribed ? <IconCheck size={20} /> : <IconArrowRight size={20} />
          }
        >
          {subscribed ? "Subscribed!" : "Subscribe"}
        </Button>
      </div>
    </div>
  );
};

export default Subscribe;
