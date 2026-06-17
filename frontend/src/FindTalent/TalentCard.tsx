import { useState } from "react";
import { Avatar, Text, Badge, Button, Divider } from "@mantine/core";
import { IconBriefcase, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const TalentCard = (props: any) => {
  // save/favorite state
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-mine-shaft-900 p-5 rounded-xl border border-mine-shaft-700 flex flex-col gap-3 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-300 hover:border-bright-sun-400 transition-all duration-300 cursor-pointer">
      <div className="flex gap-3 items-center">
        <Link to={`/talent-profile/${props.userId}`} className="flex gap-3 items-center flex-1">
          {/* candidates have no photo, so Avatar shows initials from the name */}
          <Avatar name={props.name} color="initials" size="lg" className="rounded-full" />
          <div className="flex-grow">
            <div className="font-bold text-mine-shaft-100 text-lg">{props.name}</div>
            <div className="text-sm text-mine-shaft-400">
              {props.role}
              {props.experienceYears != null && ` • ${props.experienceYears} yrs exp`}
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
        {(!props.topSkills || props.topSkills.length === 0) && (
          <Text className="!text-xs !text-mine-shaft-400">No skills listed yet.</Text>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="font-bold text-bright-sun-400 text-xl">
          {props.expectedCtc || "—"}
        </div>
        {props.experienceYears != null && (
          <div className="flex items-center gap-1 text-xs text-mine-shaft-400">
            <IconBriefcase className="h-4 w-4" stroke={1.5} />
            <span>{props.experienceYears} yrs</span>
          </div>
        )}
      </div>

      <Divider color="mineShaft.7" size="xs" />

      <Link to={`/talent-profile/${props.userId}`}>
        <Button color="bright-sun.4" variant="outline" fullWidth>
          View Profile
        </Button>
      </Link>
    </div>
  );
};

export default TalentCard;
