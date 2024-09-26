import { ErrorResponse } from "../../types";
import { useState, useEffect } from "react";
import { useUploadSingleImageMutation } from "../../slices/uploadsApiSlice";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Aside from "../../components/Aside";

const EditProfile = () => {
  const { data: userData, error, refetch } = useGetUserProfileQuery({});
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateProfileMutation();
  const [uploadProductImage] = useUploadSingleImageMutation();

  // Initialize state
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    aboutMe: "",
    socials: {
      fbLink: "",
      igLink: "",
      twitterLink: "",
      linkedinLink: "",
    },
    image: "",
  });

  // Update formData when userData is fetched
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        address: userData.address || "",
        aboutMe: userData.aboutMe || "",
        socials: {
          fbLink: userData.socials?.fbLink || "",
          igLink: userData.socials?.igLink || "",
          twitterLink: userData.socials?.twitterLink || "",
          linkedinLink: userData.socials?.linkedinLink || "",
        },
        image: userData.image || "",
      });
    }
  }, [userData]);

  // Handle changes in form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;

    // Check if the field is part of socials
    if (["fbLink", "igLink", "twitterLink", "linkedinLink"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        socials: { ...prev.socials, [id]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      (error as ErrorResponse)?.data?.error ||
      (error as ErrorResponse)?.data?.message ||
      "An unknown error occurred.";
    toast.error(errorMessage);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await updateProfile(formData).unwrap();
      toast.success(response.message);
      refetch();
    } catch (error) {
      handleError(error);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileData = new FormData();
      fileData.append("image", selectedFile);

      try {
        const response = await uploadProductImage(fileData).unwrap();
        setFormData((prev) => ({ ...prev, image: response.image }));
      } catch (error) {
        handleError(error);
      }
    }
  };

  const links = [
    { to: "/profile/edit", label: "Edit Your Profile", isActive: true },
    { to: "/settings", label: "Account Settings" },
    { to: "/my-recipes", label: "My Recipes" },
  ];

  return (
    <div className="flex">
      <Aside title="My Profile" links={links} />

      <main className="basis-full p-8 lg:basis-[85%] lg:px-14 lg:pb-12 lg:pt-8">
        <div className="header">
          <h1 className="mb-12 border-b border-gray-300 pb-3 text-2xl font-semibold">
            Edit Your Profile
          </h1>
        </div>

        <div className="profile-photo mb-8">
          <h1 className="text-xl font-medium">Profile Photo</h1>
          {error ? (
            <Message
              variant="error"
              message={
                (error as ErrorResponse)?.data?.message ||
                "Failed to load profile"
              }
            />
          ) : (
            <div className="mt-4 flex  flex-col gap-6">
              <img
                src={formData.image || userData?.image}
                alt={userData?.fullName}
                loading="lazy"
                className="mt-3 h-[100px] w-[100px] rounded-full  border object-cover"
              />
              <label
                htmlFor="file"
                className=" flex h-[40px] w-[50%]  cursor-pointer items-center  justify-center rounded-lg bg-[#2E5834] text-white transition-all duration-300 ease-linear hover:bg-[#407948] md:w-[30%]  xl:w-[20%] 2xl:w-[15%]"
              >
                Change Profile
              </label>
              <input
                type="file"
                name="image"
                id="file"
                accept="image/*"
                className="hidden"
                onChange={uploadFileHandler}
              />
            </div>
          )}
        </div>

        <div className="profile-information ">
          <h1 className="mb-4 text-xl font-medium">Profile Information</h1>
          <form className="flex flex-col gap-6" onSubmit={submitHandler}>
            <label
              htmlFor="fullName"
              className="flex flex-col gap-2 font-medium"
            >
              Full Name
              <input
                type="text"
                className="h-[55px] w-full rounded-md border border-gray-300 px-3 font-normal shadow-md md:w-1/2"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </label>

            <label
              htmlFor="address"
              className="flex flex-col gap-2 font-medium"
            >
              Address
              <input
                type="text"
                className="h-[55px] w-full rounded-md border border-gray-300 px-3 font-normal shadow-md md:w-1/2"
                id="address"
                value={formData.address}
                placeholder="Optional"
                onChange={handleChange}
              />
            </label>

            <label
              htmlFor="aboutMe"
              className="flex flex-col gap-2 font-medium"
            >
              About Me
              <textarea
                name="aboutMe"
                id="aboutMe"
                className="resize-none rounded-md border border-gray-300 p-3 font-normal shadow-md xl:w-1/2"
                rows={7}
                placeholder="Tell us about yourself"
                value={formData.aboutMe}
                onChange={handleChange}
              ></textarea>
            </label>

            <h1 className=" text-xl font-medium">Social Media</h1>
            <div className="socials__container my-4 mt-0 flex  flex-col gap-6 xl:w-1/2">
              <label htmlFor="fbLink" className="flex items-center gap-4">
                <img
                  src="/images/socials/fb.svg"
                  alt="Facebook"
                  className="h-[40px] w-[40px] object-cover"
                  loading="lazy"
                />
                <input
                  type="text"
                  id="fbLink"
                  className="h-[55px] w-full rounded-md border border-gray-300 px-3 shadow-md"
                  placeholder="Facebook Link"
                  value={formData.socials.fbLink}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="igLink" className="flex items-center gap-4">
                <img
                  src="/images/socials/ig.svg"
                  alt="Instagram"
                  className="h-[40px] w-[40px] object-cover"
                  loading="lazy"
                />
                <input
                  type="text"
                  id="igLink"
                  className="h-[55px] w-full rounded-md border border-gray-300 px-3 shadow-md"
                  placeholder="Instagram Link"
                  value={formData.socials.igLink}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="twitterLink" className="flex items-center gap-4">
                <img
                  src="/images/socials/twitter.svg"
                  alt="Twitter"
                  className="h-[40px] w-[40px] object-cover"
                  loading="lazy"
                />
                <input
                  type="text"
                  id="twitterLink"
                  className="h-[55px] w-full rounded-md border border-gray-300 px-3 shadow-md"
                  placeholder="Twitter Link"
                  value={formData.socials.twitterLink}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="linkedinLink" className="flex items-center gap-4">
                <img
                  src="/images/socials/linkedin.svg"
                  alt="LinkedIn"
                  className="h-[40px] w-[40px] object-cover"
                  loading="lazy"
                />
                <input
                  type="text"
                  id="linkedinLink"
                  className="h-[55px] w-full rounded-md border border-gray-300 px-3 shadow-md"
                  placeholder="LinkedIn Link"
                  value={formData.socials.linkedinLink}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button
              type="submit"
              className="h-[50px] w-full rounded-full bg-[#2E5834] text-white transition-all duration-300 ease-linear hover:bg-[#407948] lg:w-[30%] 2xl:w-[20%]"
            >
              {loadingUpdateProfile ? (
                <div className="flex items-center justify-center gap-3">
                  <l-dot-pulse
                    size="38"
                    speed="1.3"
                    color="white"
                  ></l-dot-pulse>
                </div>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
