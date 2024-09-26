import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ErrorResponse, Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import AuthComponent from "../components/AuthComponent";
import { RootState } from "../types";
import { useForm, SubmitHandler } from "react-hook-form";

type FormFields = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate, isLoggedIn]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await login(data).unwrap();
      navigate(response.redirectTo);
    } catch (error) {
      console.log(error);

      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-full flex-col-reverse md:h-full md:flex-col-reverse lg:flex-row">
      <div className="relative lg:basis-[40%] xl:basis-1/2 2xl:basis-[60%] ">
        <div className="relative h-full w-full lg:h-screen">
          <img
            src="/images/auth-bg.jpg"
            alt="auth"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex flex-col items-start justify-center bg-black bg-opacity-50 p-10 md:p-20  lg:px-16">
                <h1 className="text-3xl font-medium leading-[2.5rem] text-white md:text-4xl md:leading-[3rem] lg:text-3xl 2xl:w-[20em] 2xl:text-4xl">
                  Embark on a culinary journey with us!
                </h1>
                <h1 className="2xl:text-4x text-3xl font-medium leading-[2.5rem] text-white md:text-4xl md:leading-[3rem]  lg:text-3xl 2xl:w-[20em] 2xl:text-4xl">
                  Login to unlock a world of delicious recipes, and personalized
                  cooking experiences.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 md:px-20 md:py-16 lg:basis-[60%] lg:px-16 xl:basis-1/2 xl:px-20 xl:py-20 2xl:basis-[40%]">
        <div className="flex items-center gap-6">
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-[20%] object-cover"
            loading="lazy"
          />
          <h1 className=" text-2xl font-bold  md:text-3xl xl:text-4xl">
            Login
          </h1>
        </div>

        <AuthComponent />

        <div className="mb-3 mt-6 flex items-center gap-4">
          <div className="h-[1px] w-full bg-gray-200" />
          <span>OR</span>
          <div className="h-[1px] w-full bg-gray-200" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-5 flex flex-col gap-6"
        >
          <label htmlFor="" className="flex flex-col gap-2">
            Email Address
            <input
              type="email"
              className="h-[55px] rounded-md border border-gray-300 px-3 shadow-md"
              placeholder="email@domain.com"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address.",
                },
              })}
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </label>
          <label htmlFor="" className="flex flex-col gap-2">
            Password
            <input
              type="password"
              className="h-[55px] rounded-md border border-gray-300 px-3 shadow-md"
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </label>
          <button
            disabled={isSubmitting}
            type="submit"
            className="mt-3 h-[50px] rounded-md bg-[#2E5834] text-white transition-all duration-300 ease-linear hover:bg-[#407948]"
          >
            {isSubmitting ? (
              <l-dot-pulse size="38" speed="1.3" color="white"></l-dot-pulse>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
        <span className="text-[#636363]">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-[#2E5834]">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
