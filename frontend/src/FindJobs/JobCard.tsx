import { IconBookmark, IconClockHour3 } from "@tabler/icons-react";
import { Text, Divider } from "@mantine/core";

const JobCard = (props: any) => {
  return (
    <div className="bg-mine-shaft-900 p-4 w-72 rounded-xl border border-mine-shaft-700 flex flex-col gap-3 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-300 hover:border-bright-sun-400 transition-all duration-300 cursor-pointer">

      <div className="flex flex-wrap gap-2 [&>div]:py-1 [&>div]:px-2 [&>div]:bg-mine-shaft-800 [&>div]:text-bright-sun-400 [&>div]:rounded-lg text-xs">
        <div>{props.experience}</div>
        <div>{props.jobType}</div>
        <div>{props.location}</div>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-mine-shaft-800 rounded-md shrink-0">
            <img className="h-7 w-7 object-contain" src={`/Icons/${props.company}.png`} alt={`${props.company} logo`} />
          </div>
          <div>
            <div className="font-bold text-mine-shaft-100">{props.jobTitle}</div>
            <div className="text-xs text-mine-shaft-400 mt-0.5">
              {props.company} &#x2022; {props.applicants} Applicants
            </div>
          </div>
        </div>
        <IconBookmark className="text-mine-shaft-300 cursor-pointer hover:text-bright-sun-400 transition-colors shrink-0 mt-1" />
      </div>

      <Text className="!text-xs text-justify !text-mine-shaft-300" lineClamp={3}>
        {props.description}
      </Text>

      <Divider size="xs" color="mine-shaft.7" />

      <div className="flex justify-between items-center">
        <div className="font-bold text-bright-sun-400">&#8377;{props.package}</div>
        <div className="flex gap-1 text-xs text-mine-shaft-400 items-center">
          <IconClockHour3 className="h-4 w-4" stroke={1.5} /> {props.postedDaysAgo} days ago
        </div>
      </div>

    </div>
  );
};

export default JobCard;
