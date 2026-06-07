import { useState } from "react";
import { Avatar, Text, Badge, Button, Divider } from "@mantine/core";
import { IconMapPin, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const TalentCard = (props: any) => {
  // save/favorite state
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-mine-shaft-900 p-5 rounded-xl border border-mine-shaft-700 flex flex-col gap-3 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-300 hover:border-bright-sun-400 transition-all duration-300 cursor-pointer">
      <div className="flex gap-3 items-center">
        <Link to="/talent-profile" state={props} className="flex gap-3 items-center flex-1">
          <Avatar
            src={`/${props.image}.png`}
            alt={props.name}
            size="lg"
            className="rounded-full"
          />
          <div className="flex-grow">
            <div className="font-bold text-mine-shaft-100 text-lg">
              {props.name}
            </div>
            <div className="text-sm text-mine-shaft-400">
              {props.role} &bull; {props.company}
            </div>
          </div>
        </Link>
        <IconHeart
          onClick={() => setSaved(!saved)}
          className={`${
            saved ? "text-red-500" : "text-mine-shaft-300 hover:text-red-400"
          } transition-colors cursor-pointer shrink-0`}
          size={20}
          fill={saved ? "currentColor" : "none"}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {props.topSkills?.map((skill: string, i: number) => (
          <Badge
            key={i}
            size="sm"
            variant="light"
            color="bright-sun.4"
            className="!text-bright-sun-400 !bg-mine-shaft-800"
          >
            {skill}
          </Badge>
        ))}
      </div>

      <Text
        className="!text-xs text-justify !text-mine-shaft-300"
        lineClamp={4}
      >
        {props.about}
      </Text>

      <div className="flex justify-between items-center">
        <div className="font-bold text-bright-sun-400 text-xl">
          {props.expectedCtc}
        </div>
        <div className="flex items-center gap-1 text-xs text-mine-shaft-400">
          <IconMapPin className="h-4 w-4" stroke={1.5} />
          <span>{props.location}</span>
        </div>
      </div>

      <Divider color="mineShaft.7" size="xs" />

      <div className="flex [&>*]:w-1/2 [&>*]:p-1">
        <Link to="/talent-profile" state={props}>
          <Button color="bright-sun.4" variant="outline" fullWidth>
            Profile
          </Button>
        </Link>
        <div>
          <Button
            className="!bg-[#937838]"
            color="bright-sun.4"
            variant="filled"
            fullWidth
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
