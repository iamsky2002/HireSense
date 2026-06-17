import { useState } from "react";
import { Avatar, Text, Badge, Button } from "@mantine/core";
import { IconMapPin, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { talents } from "../Data/TalentData";

// Sidebar showing recommended candidates
const RecommendTalent = (props: any) => {
  const { currentName } = props;

  // Filter out current profile and show top 4
  const recommendedList = talents.filter((t: any) => t.name !== currentName).slice(0, 4);

  return (
    <div className="w-1/3 flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-mine-shaft-100">Recommended Talent</h2>
      <div className="flex flex-col gap-4">
        {recommendedList.map((talent: any, index: number) => {
          return (
            <RecommendCard key={index} {...talent} />
          );
        })}
      </div>
    </div>
  );
};

// Small card component for recommended talent
const RecommendCard = (talent: any) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-mine-shaft-900 p-5 rounded-xl border border-mine-shaft-700 flex flex-col gap-3 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-300 hover:border-bright-sun-400 transition-all duration-300 cursor-pointer">
      
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 items-center">
          <Avatar src={`/${talent.image}.png`} alt={talent.name} size="md" className="rounded-full" />
          <div>
            <div className="font-semibold text-mine-shaft-100 text-sm">{talent.name}</div>
            <div className="text-xs text-mine-shaft-400">
              {talent.role} &bull; {talent.company}
            </div>
          </div>
        </div>
        <IconHeart
          onClick={() => setSaved(!saved)}
          className={`${
            saved ? "text-red-500" : "text-mine-shaft-300 hover:text-red-400"
          } transition-colors cursor-pointer shrink-0`}
          size={18}
          fill={saved ? "currentColor" : "none"}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {talent.topSkills?.map((skill: string, i: number) => (
          <Badge
            key={i}
            size="xs"
            variant="light"
            color="bright-sun.4"
            className="!text-bright-sun-400 !bg-mine-shaft-800"
          >
            {skill}
          </Badge>
        ))}
      </div>

      <Text className="!text-[11px] text-justify !text-mine-shaft-300" lineClamp={2}>
        {talent.about}
      </Text>

      <div className="flex justify-between items-center text-xs text-mine-shaft-400 pt-1">
        <div>Exp: 3 Years</div>
        <div className="flex items-center gap-0.5">
          <IconMapPin size={12} className="text-mine-shaft-400" />
          <span>{talent.location.split(",")[0]}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Link to="/talent-profile" state={talent} className="w-1/2">
          <Button color="bright-sun.4" variant="outline" fullWidth size="xs">
            Profile
          </Button>
        </Link>
        <div className="w-1/2">
          <Button
            className="!bg-[#937838]"
            color="bright-sun.4"
            variant="filled"
            fullWidth
            size="xs"
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendTalent;
