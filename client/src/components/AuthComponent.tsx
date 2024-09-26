import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { app } from "../firebase";
import { useLoginSocialsAuthMutation } from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/authSlice";
import { Dispatch } from "redux";
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "../types";

const AuthComponent = () => {
  const navigate = useNavigate();
  const [loginSocialsAuth] = useLoginSocialsAuthMutation();
  const dispatch: Dispatch = useDispatch();

  // Generalized authentication handler
  const handleSocialAuth = async (provider: AuthProvider) => {
    try {
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;

      const response = await loginSocialsAuth({
        fullName: displayName,
        email: email,
        image: photoURL,
      }).unwrap();

      navigate(response.redirectTo);
      dispatch(setUserInfo(response.data));
    } catch (error) {
      console.error(error);

      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="google-fb-auth__container mt-8">
      <div className="flex w-full flex-col gap-6 md:flex-row">
        <button
          onClick={() => handleSocialAuth(new FacebookAuthProvider())}
          className="flex h-[55px] w-full items-center justify-center gap-3 rounded-md border border-gray-300 text-base shadow-md transition-all  duration-300  hover:bg-gray-50"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2710_15604)">
              <path
                d="M18 2.16602C13.8007 2.16602 9.77343 3.83417 6.8041 6.80349C3.83478 9.77282 2.16663 13.8001 2.16663 17.9993C2.16663 22.1986 3.83478 26.2259 6.8041 29.1952C9.77343 32.1645 13.8007 33.8327 18 33.8327C22.1992 33.8327 26.2265 32.1645 29.1958 29.1952C32.1651 26.2259 33.8333 22.1986 33.8333 17.9993C33.8333 13.8001 32.1651 9.77282 29.1958 6.80349C26.2265 3.83417 22.1992 2.16602 18 2.16602Z"
                fill="#039BE5"
              />
              <path
                d="M20.1433 22.1971H24.2408L24.8841 18.0346H20.1424V15.7596C20.1424 14.0305 20.7074 12.4971 22.3249 12.4971H24.9241V8.86464C24.4674 8.80297 23.5016 8.66797 21.6766 8.66797C17.8658 8.66797 15.6316 10.6805 15.6316 15.2655V18.0346H11.7141V22.1971H15.6316V33.638C16.4074 33.7546 17.1933 33.8338 17.9999 33.8338C18.7291 33.8338 19.4408 33.7671 20.1433 33.6721V22.1971Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_2710_15604">
                <rect width="36" height="36" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Login with Facebook
        </button>
        <button
          onClick={() => handleSocialAuth(new GoogleAuthProvider())}
          className="flex h-[55px] w-full items-center justify-center gap-3 rounded-md border border-gray-300  shadow-md transition-all  duration-300  hover:bg-gray-50"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2710_5748)">
              <path
                d="M32.7083 15.0623H31.5V15H18V21H26.4773C25.2405 24.4928 21.9173 27 18 27C13.0298 27 9 22.9703 9 18C9 13.0298 13.0298 9 18 9C20.2943 9 22.3815 9.8655 23.9708 11.2793L28.2135 7.0365C25.5345 4.53975 21.951 3 18 3C9.71625 3 3 9.71625 3 18C3 26.2838 9.71625 33 18 33C26.2838 33 33 26.2838 33 18C33 16.9943 32.8965 16.0125 32.7083 15.0623Z"
                fill="#FFC107"
              />
              <path
                d="M4.72949 11.0183L9.65774 14.6325C10.9912 11.331 14.2207 9 18 9C20.2942 9 22.3815 9.8655 23.9707 11.2793L28.2135 7.0365C25.5345 4.53975 21.951 3 18 3C12.2385 3 7.24199 6.25275 4.72949 11.0183Z"
                fill="#FF3D00"
              />
              <path
                d="M18 33.0005C21.8745 33.0005 25.395 31.5178 28.0567 29.1065L23.4142 25.178C21.9082 26.3188 20.0362 27.0005 18 27.0005C14.0985 27.0005 10.7857 24.5128 9.53774 21.041L4.64624 24.8098C7.12874 29.6675 12.1702 33.0005 18 33.0005Z"
                fill="#4CAF50"
              />
              <path
                d="M32.7083 15.0623H31.5V15H18V21H26.4773C25.8833 22.6777 24.804 24.1245 23.412 25.1782L23.4143 25.1767L28.0568 29.1052C27.7283 29.4037 33 25.5 33 18C33 16.9942 32.8965 16.0125 32.7083 15.0623Z"
                fill="#1976D2"
              />
            </g>
            <defs>
              <clipPath id="clip0_2710_5748">
                <rect width="36" height="36" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default AuthComponent;
