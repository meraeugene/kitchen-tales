import { ErrorResponse } from "../../types";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useSendEmailResetLinkMutation,
  useSendPasswordResetLinkToEmailMutation,
} from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Aside from "../../components/Aside";

const AccountSettings = () => {
  const [
    sendPasswordResetLinkToEmail,
    { isLoading: loadingSendPasswordResetLink },
  ] = useSendPasswordResetLinkToEmailMutation();

  const [sendEmailResetLink, { isLoading: loadingSendEmailResetLink }] =
    useSendEmailResetLinkMutation();

  const { data: userData, error, isLoading } = useGetUserProfileQuery({});

  // Common error handler function
  const handleError = (error: unknown) => {
    const errorMessage =
      (error as ErrorResponse)?.data?.error ||
      (error as ErrorResponse)?.data?.message ||
      "An unknown error occurred.";
    toast.error(errorMessage);
  };

  // Function to handle both email and password reset link
  const handleResetLink = async (
    resetAction: () => Promise<any>,
    successMessage: string,
  ) => {
    try {
      const response = await resetAction();
      toast.success(successMessage || response.message);
    } catch (error) {
      handleError(error);
    }
  };

  const links = [
    { to: "/profile/edit", label: "Edit Your Profile" },
    { to: "/settings", label: "Account Settings", isActive: true },
    { to: "/my-recipes", label: "My Recipes" },
  ];

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message
      variant="error"
      message={
        (error as ErrorResponse)?.data?.message || "Failed to load profile"
      }
    />
  ) : (
    <div className="flex">
      <Aside title="My Profile" links={links} />

      <main className="basis-full p-8 lg:basis-[85%] lg:px-14 lg:pb-16 lg:pt-8">
        <div className="header">
          <h1 className="mb-6 border-b border-gray-300 pb-3 text-2xl font-semibold">
            Account Settings
          </h1>
        </div>

        <div>
          <div className="flex flex-col gap-12">
            {/* Email field */}
            <label htmlFor="email" className="flex flex-col gap-2 font-medium">
              Email
              <input
                type="email"
                className="h-[55px] w-full rounded-md border border-gray-300 px-3 font-normal shadow-md md:w-1/2 xl:w-1/3 2xl:w-1/4"
                defaultValue={userData?.email}
                id="email"
                disabled
                required
              />
            </label>

            {/* Email Reset Section */}
            <div>
              <h2 className=" mb-2 text-xl font-medium">Email Reset</h2>
              <p className="xl:w-[85%] 2xl:w-[60%]">
                Ensuring your security is our top concern. To update your email,
                simply click the button provided below. We'll promptly send a
                link to reset your email address for added account protection.
              </p>

              <button
                onClick={() =>
                  handleResetLink(
                    () => sendEmailResetLink({}).unwrap(),
                    "Email reset link sent successfully.",
                  )
                }
                className="mt-6 h-[50px] w-full rounded-full bg-[#2E5834] text-white transition-all duration-300 ease-linear hover:bg-[#407948] md:w-1/2  xl:w-1/3 2xl:w-1/4"
              >
                {loadingSendEmailResetLink ? (
                  <l-dot-pulse
                    size="38"
                    speed="1.3"
                    color="white"
                  ></l-dot-pulse>
                ) : (
                  <span>Reset Email</span>
                )}
              </button>
            </div>

            {/* Password Reset Section */}
            <div>
              <h2 className=" mb-2 text-xl font-medium">Password Reset</h2>
              <p className="xl:w-[85%] 2xl:w-[60%]">
                Your security is our priority. If you want to change your
                password, click the button below, and we will send a password
                reset link to your email address to keep your account safe and
                sound.
              </p>

              <button
                onClick={() =>
                  handleResetLink(
                    () => sendPasswordResetLinkToEmail({}).unwrap(),
                    "Password reset link sent successfully.",
                  )
                }
                className="mt-6 h-[50px]  w-full rounded-full bg-[#2E5834]  text-white transition-all duration-300 ease-linear hover:bg-[#407948] md:w-1/2  xl:w-1/3 2xl:w-1/4"
              >
                {loadingSendPasswordResetLink ? (
                  <l-dot-pulse
                    size="38"
                    speed="1.3"
                    color="white"
                  ></l-dot-pulse>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
