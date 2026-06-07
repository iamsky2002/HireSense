const CertiCard = (props: any) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <div className="p-2 bg-mine-shaft-800 rounded-md">
          <img className="h-7" src={`/Icons/${props.issuer}.png`} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">{props.name}</div>
          <div className="text-xs text-mine-shaft-300">{props.issuer}</div>
        </div>
      </div>
      <div className="text-sm text-mine-shaft-300 text-right">
        <div>{props.issueDate}</div>
        <div>ID: {props.certificateId}</div>
      </div>
    </div>
  );
};

export default CertiCard;


