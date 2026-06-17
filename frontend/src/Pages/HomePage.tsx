import DreamJob from "../LandingPage/DreamJob";
import Companies from "../LandingPage/Companies";
import NewJobCategory from "../LandingPage/NewJobCategory";
import Working from "../LandingPage/Working";
import Features from "../LandingPage/Features";
import CallToAction from "../LandingPage/CallToAction";

const HomePage = () => {
  return (
    <div>
      <DreamJob />
      <Companies />
      <NewJobCategory />
      <Working />
      <Features />
      <CallToAction />
    </div>
  );
};

export default HomePage;
