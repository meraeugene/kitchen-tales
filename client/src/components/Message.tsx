interface MessageProps {
  variant: "success" | "error" | "info";
  message?: string;
}

const Message = ({ variant, message }: MessageProps) => {
  return (
    (variant === "success" && (
      <div className=" rounded-[4px] border border-green-300 bg-green-100 px-3 py-4 font-normal text-green-700">
        {message}
      </div>
    )) ||
    (variant === "error" && (
      <div className=" rounded-[4px] border border-red-300 bg-red-100 px-3 py-4 font-normal text-red-700">
        {message}
      </div>
    )) ||
    (variant === "info" && (
      <div className=" rounded-[4px] border  border-blue-300 bg-blue-100 px-3 py-4 text-sm  font-normal  text-gray-800 lg:text-lg">
        {message}
      </div>
    ))
  );
};

export default Message;
