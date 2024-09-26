import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4  py-16  text-center md:px-20 md:pb-20">
      <h1 className="text-9xl font-extrabold">404</h1>
      <h1 className="font-bold">Ooops! This page could not be found</h1>
      <p className="mb-4 text-sm font-medium md:w-1/2 lg:w-1/4">
        Sorry, but the page you are looking for does not exist, has been
        removed, name changed, or temporarily unavailable.
      </p>
      <div className="md:w-1/2 lg:w-1/4">
        <Link to="/" className="rounded-full bg-[#2E5834] px-4 py-3 text-white">
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
};

export default Error;
