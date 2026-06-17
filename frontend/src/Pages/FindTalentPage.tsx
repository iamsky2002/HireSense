import Talents from "../FindTalent/Talents";

// the Talents component handles client-side search + the real candidate list
const FindTalentPage = () => {
  return (
    <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins']">
      <Talents />
    </div>
  );
};

export default FindTalentPage;
