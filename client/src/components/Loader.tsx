import React from "react";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div
      className={`flex h-screen w-full items-center justify-center ${className}`}
    >
      <l-dot-pulse size="38" speed="1.3" color="green"></l-dot-pulse>
    </div>
  );
};

export default Loader;
