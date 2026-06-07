import { Button, Divider } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import Profile from "../TalentProfile/Profile";
import RecommendTalent from "../TalentProfile/RecommendTalent";
import { profile } from "../Data/TalentData";

const TalentProfilePage = () => {
  const location = useLocation();
  const activeProfile = location.state || profile;

  return (
    <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] p-6">


      <Link className="my-5 inline-block" to="/find-talent">
        <Button
          className="!bg-[#937838]"
          leftSection={<IconChevronLeft size={20} />}
          color="bright-sun.4"
          variant="light"
        >
          Back
        </Button>
      </Link>

      <Divider size="xs" />
      <div className="flex gap-5 my-5">
        <Profile {...activeProfile} />
        <RecommendTalent currentName={activeProfile.name} />
      </div>
    </div>
  );
};

export default TalentProfilePage;

