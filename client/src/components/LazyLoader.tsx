import Lottie from "lottie-react";
import loader from "../loader.json";

const LazyLoader = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Lottie
        animationData={loader}
        loop={true}
        style={{ width: "100px", height: "100px" }}
      />
      <h1 className="loading-text font-cormorant text-2xl font-medium md:text-3xl">
        Loading...
      </h1>
    </div>
  );
};

export default LazyLoader;
