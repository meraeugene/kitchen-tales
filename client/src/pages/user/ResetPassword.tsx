import { useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "../../slices/usersApiSlice";
import { useState } from "react";
import { ErrorResponse } from "../../types";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { isLoading: loadingResetPassword }] =
    useResetPasswordMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Password does not match");
    } else {
      try {
        const response = await resetPassword({ newPassword, token }).unwrap();
        toast.success(response.message);

        // Broadcast the logout event to other tabs/windows
        localStorage.setItem("logoutEvent", "true");
        window.location.reload();
      } catch (error) {
        console.log(error);

        const errorMessage =
          (error as ErrorResponse)?.data?.error ||
          (error as ErrorResponse)?.data?.message ||
          "An unknown error occurred.";

        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row lg:h-screen">
      <div className="relative basis-full 2xl:basis-[50%] ">
        <div className="relative h-full w-full">
          <img
            src="/images/auth-bg.jpg"
            alt="auth"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex flex-col items-start justify-center bg-black bg-opacity-50 p-8 lg:px-16 ">
                <h1 className=" w-full text-2xl font-medium leading-[2.5rem] text-white lg:text-3xl lg:leading-[3rem] 2xl:text-4xl 2xl:leading-[3.5rem] ">
                  Ensuring your security is our top priority. Please update your
                  password by completing the necessary fields.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full basis-full flex-col items-center justify-center px-8 py-10 lg:p-16 2xl:basis-[50%] ">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/images/logo.png"
            alt="logo"
            className=" w-[40%] object-cover md:w-[50%] lg:w-[60%]"
            loading="lazy"
          />
          <h1 className=" text-2xl font-bold lg:text-3xl 2xl:text-4xl">
            Reset Password
          </h1>
        </div>

        <form
          onSubmit={submitHandler}
          className="mt-8  flex w-full flex-col gap-4 2xl:mb-5 2xl:mt-12 2xl:w-[70%]"
        >
          <label htmlFor="" className="flex flex-col gap-2">
            New Password
            <input
              type="password"
              className="h-[55px] rounded-md border border-gray-300 px-3 shadow-md"
              id="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label htmlFor="" className="flex flex-col gap-2">
            Confirm Password
            <input
              type="password"
              className="h-[55px] rounded-md border border-gray-300 px-3 shadow-md"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="mt-6  h-[50px] rounded-md bg-[#2E5834] text-white transition-all duration-300 ease-linear hover:bg-[#407948]"
          >
            {loadingResetPassword ? (
              <div className="flex items-center justify-center gap-3">
                <l-dot-pulse size="38" speed="1.3" color="white"></l-dot-pulse>
              </div>
            ) : (
              <span>Change Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;