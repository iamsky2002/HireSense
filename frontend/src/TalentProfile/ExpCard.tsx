const ExpCard = (props: any) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-mine-shaft-800 rounded-md shrink-0">
            <img
              className="h-7 w-7 object-contain"
              src={`/Companies/${props.company}.png`}
              alt={`${props.company} logo`}
            />
          </div>
          <div>
            <div className="font-bold text-mine-shaft-100 text-sm">
              {props.title}
            </div>
            <div className="text-xs text-mine-shaft-400 mt-0.5">
              {props.company} &bull; {props.location}
            </div>
          </div>
        </div>

        <div className="text-xs text-mine-shaft-400 font-medium">
          {props.startDate}, {props.endDate}
        </div>
      </div>

      {props.description && (
        <p className="text-xs text-mine-shaft-300 text-justify leading-relaxed pl-[3.25rem]">
          {props.description}
        </p>
      )}
    </div>
  );
};

export default ExpCard;
