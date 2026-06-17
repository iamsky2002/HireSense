// Explore career opportunities section showing a grid of categories
import { Carousel } from "@mantine/carousel";
import { jobCategory } from "../Data/Data";
const NewJobCategory = () => {
  return (
    <div className="mt-20 pb-5">
      <div className="text-4xl text-center font-semibold mb-3 text-mine-shaft-100">
        Explore <span className="text-bright-sun-400">Career</span>{" "}
        Opportunities
      </div>
      <div className="text-lg mx-auto text-mine-shaft-300 text-center w-1/2 mb-12">
        Discover opportunities that perfectly match your skills and ambitions.
        Take the next step in your professional journey with us. Begin your next
        great career adventure today.
      </div>
      <Carousel
        slideSize="22%"
        slideGap="md"
        emblaOptions={{ loop: true }}
        classNames={{
          root: "group",
          controls:
            "transition-opacity duration-300 opacity-0 group-hover:opacity-100",
          control:
            "bg-bright-sun-400 border-none text-mine-shaft-900 hover:bg-mine-shaft-900 hover:text-bright-sun-400 hover:border hover:border-bright-sun-400 hover:shadow-[0_0_10px_2px_#f99b07] w-10 h-10",
        }}
      >
        {jobCategory.map((category, index) => (
          <Carousel.Slide key={index}>
            <div className="flex flex-col items-center w-64 gap-3 px-5 pb-5 border border-bright-sun-300 rounded-xl pt-4 cursor-pointer hover:bg-bright-sun-400/10 hover:border-none hover:border-bright-sun-300 hover:shadow-[0_0_0_4px_3px_#a34d00]">
              <div className="p-1 bg-bright-sun-300 rounded-full">
                <img
                  className="h-8 w-8"
                  src={`/Category/${category.name}.png`}
                  alt={category.name}
                />
              </div>
              <div className="text-mine-shaft-100 text-xl font-semibold">
                {category.name}
              </div>
              <div className="text-sm text-center text-mine-shaft-300 mt-2">
                {category.desc}
              </div>
              <div className="text-bright-sun-300 text-lg mt-3">
                {category.jobs}+ new job posted
              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};
export default NewJobCategory;
