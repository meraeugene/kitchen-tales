import { IoIosAdd, IoIosInformationCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ErrorResponse, RootState } from "../types";
import { CiBookmark, CiLogin } from "react-icons/ci";
import { LiaHomeSolid, LiaUserEditSolid } from "react-icons/lia";
import { CiLogout } from "react-icons/ci";
import {
  useGetUserProfileQuery,
  useLogoutMutation,
} from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { logout, setIsLoggedIn, setUserInfo } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useValidateTokenQuery } from "../slices/usersApiSlice";
import {
  clearBookmarks,
  setRecipeBookmarksID,
} from "../slices/bookmarkedRecipesSlice";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { SlNotebook } from "react-icons/sl";
import { VscBook } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const [profileNav, setProfileNav] = useState<boolean>(false);
  const [mobileNav, setMobileNav] = useState<boolean>(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // Queries
  const { data: userData, isLoading } = useGetUserProfileQuery({});
  const validateTokenQuery = useValidateTokenQuery({});

  useEffect(() => {
    const fetchLoginStatus = () => {
      try {
        const { isError, data } = validateTokenQuery;
        dispatch(setUserInfo(data));
        dispatch(setIsLoggedIn(!isError));
      } catch (error) {
        console.error("Error while handling login status:", error);
      }
    };

    fetchLoginStatus();
  }, [dispatch, validateTokenQuery]);

  const [logoutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      setProfileNav(false);

      const res = await logoutApi({}).unwrap();

      dispatch(logout());
      window.location.href = res.redirectTo;
    } catch (error) {
      console.log(error);

      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(clearBookmarks());
    } else {
      dispatch(setRecipeBookmarksID(userData?.bookmarks));
    }
  }, [dispatch, isLoggedIn, userData?.bookmarks]);

  const toggleNav = () => {
    setMobileNav((prev) => !prev);
    document.body.classList.toggle("menu-open");
  };

  return (
    <header
      className={`${location.pathname === "/reset-email" || location.pathname === "/reset-password" ? "hidden" : ""} sticky top-0 z-10 w-full border-b border-[#E9E9E9] bg-white py-1`}
    >
      <div className="desktop-header hidden w-full  items-center justify-between md:flex md:px-8 lg:px-16  xl:px-24">
        <div className=" flex items-center gap-14">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="" className="w-28" />
          </Link>
          <nav>
            <ul className="flex gap-10 md:gap-8">
              <Link
                className={`transition-all duration-300 ease-in-out ${location.pathname === "/recipes" ? "text-[#407948]" : ""}`}
                to="/recipes"
                onClick={() => setProfileNav(false)}
              >
                RECIPES
              </Link>
              <Link
                className={`transition-all duration-300 ease-in-out ${location.pathname === "/articles" ? "text-[#407948]" : ""}`}
                to="/articles"
                onClick={() => setProfileNav(false)}
              >
                ARTICLES
              </Link>
              <Link
                className={`transition-all duration-300 ease-in-out ${location.pathname === "/about" ? "text-[#407948]" : ""}`}
                to="/about"
                onClick={() => setProfileNav(false)}
              >
                ABOUT
              </Link>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-5 ">
          {isLoggedIn && (
            <div className="flex items-center gap-1 transition-all duration-300 ease-in-out hover:text-[#407948]  ">
              <IoIosAdd size={20} />
              <Link to="/add-recipe" onClick={() => setProfileNav(false)}>
                ADD A RECIPE
              </Link>
            </div>
          )}
          {isLoggedIn ? (
            <div className="relative ">
              {isLoading ? (
                <l-tailspin
                  size="20"
                  stroke="3.5"
                  speed="1"
                  color="green"
                ></l-tailspin>
              ) : (
                <img
                  src={userData?.image}
                  alt={userData?.fullName}
                  className="h-[35px] w-[35px] cursor-pointer rounded-full border object-cover"
                  onClick={() => setProfileNav((prev) => !prev)}
                />
              )}
              {profileNav && (
                <div className="absolute right-[5px]  top-[40px] z-10  border border-gray-100 bg-white shadow-sm">
                  <Link
                    to="/profile/edit"
                    className="flex cursor-pointer items-center gap-2  px-4 py-2  text-sm hover:bg-slate-100"
                    onClick={() => setProfileNav(false)}
                  >
                    <LiaUserEditSolid size={20} /> My Profile
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="flex cursor-pointer items-center gap-2  px-4 py-2 text-sm hover:bg-slate-100"
                    onClick={() => setProfileNav(false)}
                  >
                    <CiBookmark size={20} />
                    Bookmarks
                  </Link>
                  <div
                    className="flex cursor-pointer items-center gap-2  px-4  py-2  text-sm hover:bg-slate-100"
                    onClick={logoutHandler}
                  >
                    <CiLogout size={20} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/auth/login"
                className="rounded-2xl bg-[#2E5834] px-4  py-1  text-white"
              >
                LOGIN
              </Link>
              <Link
                to="/auth/register"
                className="rounded-2xl bg-[#2E5834] px-4 py-1  text-white"
              >
                SIGNUP
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className=" mobile-header flex items-center justify-between px-8 md:hidden  lg:hidden">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="" className="w-20" />
        </Link>

        <button onClick={toggleNav}>
          <RxHamburgerMenu size={24} />
        </button>
      </div>

      {mobileNav && (
        <div className=" mobile-nav slide-in-right nav-color fixed right-0 top-0 z-[50]     h-screen w-[60%] md:hidden">
          <div className="relative p-10  px-8">
            <button
              onClick={toggleNav}
              className="absolute right-[30px] top-[10px]"
            >
              <IoCloseOutline size={30} />
            </button>
            <nav>
              <ul className="mt-10 flex flex-col gap-6 ">
                <Link
                  className={`flex items-center gap-3 text-lg transition-all duration-300 ease-in-out ${location.pathname === "/" ? "text-[#407948]" : ""}`}
                  to="/"
                  onClick={toggleNav}
                >
                  <LiaHomeSolid />
                  Home
                </Link>
                <Link
                  className={`flex items-center gap-3 text-lg transition-all duration-300 ease-in-out ${location.pathname === "/recipes" ? "text-[#407948]" : ""}`}
                  to="/recipes"
                  onClick={toggleNav}
                >
                  <SlNotebook />
                  Recipes
                </Link>
                <Link
                  className={`flex items-center gap-3 text-lg transition-all  duration-300 ease-in-out ${location.pathname === "/articles" ? "text-[#407948]" : ""}`}
                  to="/articles"
                  onClick={toggleNav}
                >
                  <VscBook />
                  Articles
                </Link>
                <Link
                  className={`flex items-center gap-3  text-lg transition-all  duration-300 ease-in-out ${location.pathname === "/about" ? "text-[#407948]" : ""}`}
                  to="/about"
                  onClick={toggleNav}
                >
                  <IoIosInformationCircleOutline />
                  About
                </Link>

                {isLoggedIn ? (
                  <div className="flex flex-col gap-6">
                    <Link
                      className={`flex items-center gap-3   text-lg transition-all  duration-300 ease-in-out ${location.pathname === "/add-recipe" ? "text-[#407948]" : ""}`}
                      to="/add-recipe"
                      onClick={toggleNav}
                    >
                      <IoIosAdd />
                      Add Recipe
                    </Link>

                    <div className="flex flex-col ">
                      <div className="flex items-center gap-3 text-lg">
                        <CgProfile />
                        Profile
                      </div>

                      <div className="ml-[1.80rem] mt-2 flex flex-col gap-2 ">
                        <Link
                          className={`flex items-center gap-3 text-sm transition-all  duration-300 ease-in-out ${location.pathname === "/profile/edit" ? "text-[#407948]" : ""}`}
                          to="/profile/edit"
                          onClick={toggleNav}
                        >
                          Edit Profile
                        </Link>

                        <Link
                          className={`flex items-center gap-3 text-sm transition-all  duration-300 ease-in-out ${location.pathname === "/settings" ? "text-[#407948]" : ""}`}
                          to="/settings"
                          onClick={toggleNav}
                        >
                          Account Settings
                        </Link>

                        <Link
                          className={`flex items-center gap-3 text-sm transition-all  duration-300 ease-in-out ${location.pathname === "/my-recipes" ? "text-[#407948]" : ""}`}
                          to="/my-recipes"
                          onClick={toggleNav}
                        >
                          My Recipes
                        </Link>
                      </div>
                    </div>

                    <Link
                      className={`flex items-center gap-3 text-lg transition-all  duration-300 ease-in-out ${location.pathname === "/bookmarks" ? "text-[#407948]" : ""}`}
                      to="/bookmarks"
                      onClick={toggleNav}
                    >
                      <CiBookmark />
                      Bookmarks
                    </Link>

                    <div
                      className={`flex items-center gap-3 text-lg transition-all  duration-300 ease-in-out `}
                      onClick={logoutHandler}
                    >
                      <CiLogout />
                      Logout
                    </div>
                  </div>
                ) : (
                  <Link
                    className={`flex items-center gap-3 text-lg transition-all  duration-300 ease-in-out ${location.pathname === "/auth/login" ? "text-[#407948]" : ""}`}
                    to="/auth/login"
                    onClick={toggleNav}
                  >
                    <CiLogin />
                    Login
                  </Link>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
