import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "./utils/scrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tailspin } from "ldrs";
import { dotPulse } from "ldrs";
import { useDispatch } from "react-redux";
import { logout } from "./slices/authSlice.ts";
import { useLogoutMutation } from "./slices/usersApiSlice.ts";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    const handleStorageChange = () => {
      const logoutEvent = localStorage.getItem("logoutEvent");

      if (logoutEvent === "true") {
        // Clear the logout flag
        localStorage.removeItem("logoutEvent");

        // Perform the logout
        logoutApi({}).unwrap();
        dispatch(logout());
      }
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, logoutApi]);

  const location = useLocation();

  // Define an array of routes where you want to hide the footer
  const routesWithoutHeaderAndFooter = ["/auth/login", "/auth/register"];

  // Check if the current route is in the array of routes without the footer
  const hideFooterAndHeader = routesWithoutHeaderAndFooter.includes(
    location.pathname,
  );

  tailspin.register();
  dotPulse.register();

  return (
    <>
      <ScrollToTop />
      {!hideFooterAndHeader && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideFooterAndHeader && <Footer />}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={true}
        theme="light"
      />
    </>
  );
};

export default App;
