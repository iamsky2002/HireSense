import { Avatar } from "@mantine/core";
import { work } from "../Data/Data";

const Working = () => {
  return (
    <div className="mt-20 pb-5">
      <div className="text-4xl text-center font-semibold mb-3 text-mine-shaft-100">
        How to <span className="text-bright-sun-400">Get Started</span>
      </div>
      <div className="text-lg mx-auto text-mine-shaft-300 text-center w-1/2 mb-12">
        From building your resume to signing your offer letter, we guide you
        every step of the way. Effortlessly navigate through our platform to
        find and secure your dream job in just a few simple steps.
      </div>

      <div className="flex px-16 justify-between items-center">
        <div className="w-1/2 flex justify-center">
          <div className="relative">
            <img className="w-[30rem]" src="/Working/girl.png" alt="girl" />
            <div className="w-36 flex top-[15%] right-4 absolute flex-col items-center gap-1 border border-bright-sun-400 rounded-xl py-3 px-1 backdrop-blur-md">
              <Avatar
                className="!h-16 !w-16"
                src="/Avatar-4.png"
                alt="it's me"
              />
              <div className="text-sm font-semibold text-mine-shaft-200 text-center leading-tight mt-1">
                Complete your profile
              </div>
              <div className="text-[10px] text-mine-shaft-300 text-center">
                You have completed{" "}
                <span className="font-semibold text-mine-shaft-100">60%</span>
              </div>
              <div className="w-full px-2 mt-1">
                <div className="w-full bg-mine-shaft-600/50 rounded-full h-1.5">
                  <div className="bg-bright-sun-400 h-1.5 rounded-full w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {work.map((item, index) => (
            <div key={index} className="flex items-center gap-5">
              <div className="p-2.5 bg-bright-sun-400 rounded-full">
                <img
                  className="w-12 h-12"
                  src={`/Working/${item.name}.png`}
                  alt={item.name}
                />
              </div>
              <div>
                <div className="text-mine-shaft-200 text-xl font-semibold">
                  {item.name}
                </div>
                <div className="text-mine-shaft-300 text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Working;
