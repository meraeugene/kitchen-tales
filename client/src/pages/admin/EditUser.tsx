import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { ErrorResponse } from "../../types";
import { useUploadSingleImageMutation } from "../../slices/uploadsApiSlice";

const EditUser = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const { data: userData, error, refetch } = useGetUserDetailsQuery(userId!);

  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

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

  const [uploadProductImage] = useUploadSingleImageMutation();
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

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

    if (!userId) {
      // Handle case where userId is not available
      toast.error("User ID is missing.");
      return;
    }

    try {
      // Create the data to submit with userId included
      const dataToSubmit = {
        ...formData,
      };

      const response = await updateUser({ ...dataToSubmit, userId }).unwrap();
      console.log(response);
      toast.success(response.message);
      refetch();
    } catch (error) {
      handleError(error);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploadingImage(true); // Start loading
      const fileData = new FormData();
      fileData.append("image", selectedFile);

      try {
        const response = await uploadProductImage(fileData).unwrap();
        console.log(response);
        setFormData((prev) => ({ ...prev, image: response.imageUrl }));
      } catch (error) {
        handleError(error);
      } finally {
        setIsUploadingImage(false); // End loading
      }
    }
  };

  return (
    <div className="p-8 pb-16 lg:px-16 xl:px-24">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:bg-gray-100"
      >
        ← Back
      </button>

      <h1 className="mb-8 font-cormorant text-3xl xl:text-4xl">Edit User</h1>

      <form onSubmit={submitHandler} className="max-w-xl space-y-6">
        {/* Profile Image */}
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
                className="flex h-[40px] w-[60%] cursor-pointer items-center justify-center rounded  bg-green-700 px-6 py-2 text-white  transition-all duration-300 ease-linear hover:bg-green-800 disabled:opacity-50 md:w-[30%]  "
              >
                {isUploadingImage ? (
                  <l-tailspin
                    size="18"
                    stroke="3.5"
                    speed="1"
                    color="white"
                  ></l-tailspin>
                ) : (
                  "Change Profile"
                )}
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

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="mb-1 block font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="mb-1 block font-medium">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="aboutMe" className="mb-1 block font-medium">
            Bio
          </label>
          <textarea
            id="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            rows={4}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Social Media */}
        <div>
          <label htmlFor="fbLink" className="mb-1 block font-medium">
            Facebook Link
          </label>
          <input
            type="text"
            id="fbLink"
            value={formData.socials.fbLink}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Social Media */}
        <div>
          <label htmlFor="igLink" className="mb-1 block font-medium">
            Instagram Link
          </label>
          <input
            type="text"
            id="igLink"
            value={formData.socials.igLink}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Social Media */}
        <div>
          <label htmlFor="twitterLink" className="mb-1 block font-medium">
            Twitter Link
          </label>
          <input
            id="twitterLink"
            type="text"
            value={formData.socials.twitterLink}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Social Media */}
        <div>
          <label htmlFor="linkedinLink" className="mb-1 block font-medium">
            Linkedin Link
          </label>
          <input
            type="text"
            id="linkedinLink"
            value={formData.socials.linkedinLink}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={updating}
          className="w-full rounded bg-green-700 px-6 py-2 text-white transition-all hover:bg-green-800 disabled:opacity-50 md:w-1/2"
        >
          {updating ? (
            <div className="flex items-center justify-center  gap-2 ">
              <l-tailspin
                size="18"
                stroke="3.5"
                speed="1"
                color="white"
              ></l-tailspin>
              <h1>Saving</h1>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
