import SearchComponent from "../components/SearchComponent";

const Hero = () => {
  return (
    <div>
      <div className="relative ">
        <img
          src="/images/hero-img.png"
          alt="hero image"
          loading="lazy"
          className="h-auto w-full object-cover"
        />
        <div className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50"></div>
        <div
          className=" lg:full absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col text-center text-white lg:gap-4
        "
        >
          <h1 className="text-lg  font-semibold md:text-2xl lg:text-4xl lg:leading-[20px] 2xl:text-5xl ">
            Fuel your body & soul -
          </h1>
          <h1 className=" text-lg font-semibold md:text-2xl   lg:text-4xl  2xl:text-5xl ">
            find recipes that taste amazing!
          </h1>
          <div className="md:px-24 md:pt-6 lg:px-40 xl:px-[25rem] 2xl:px-[30rem]">
            <SearchComponent className="hidden md:block " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
