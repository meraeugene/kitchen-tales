import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store, persistor } from "./store.ts";
import { PersistGate } from "redux-persist/integration/react";
import LazyLoader from "./components/LazyLoader.tsx";

// Lazy load your components
const Home = lazy(() => import("./pages/Home.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Recipes = lazy(() => import("./pages/Recipes.tsx"));
const Articles = lazy(() => import("./pages/Articles.tsx"));
const RecipesByTag = lazy(() => import("./pages/RecipesByTag.tsx"));
const RecipeDetails = lazy(() => import("./pages/RecipeDetails.tsx"));
const AboutRecipeCreator = lazy(() => import("./pages/AboutRecipeCreator.tsx"));
const Error = lazy(() => import("./pages/Error.tsx"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute.tsx"));
const EditProfile = lazy(() => import("./pages/user/EditProfile.tsx"));
const AccountSettings = lazy(() => import("./pages/user/AcountSettings.tsx"));
const ResetPassword = lazy(() => import("./pages/user/ResetPassword.tsx"));
const MyRecipes = lazy(() => import("./pages/user/MyRecipes.tsx"));
const AddRecipe = lazy(() => import("./pages/user/AddRecipe.tsx"));
const Bookmarks = lazy(() => import("./pages/user/Bookmarks.tsx"));
const ResetEmail = lazy(() => import("./pages/user/ResetEmail.tsx"));

// ADMIN ROUTE
const AdminRoute = lazy(() => import("./components/AdminRoute.tsx"));
const RecipeManagement = lazy(
  () => import("./pages/admin/RecipeManagement.tsx"),
);
const UserManagement = lazy(() => import("./pages/admin/UserManagement.tsx"));

// Create a router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/auth/register",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "/recipes",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Recipes />
          </Suspense>
        ),
      },
      {
        path: "/recipe",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <RecipeDetails />
          </Suspense>
        ),
      },
      {
        path: "/recipes/tag",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <RecipesByTag />
          </Suspense>
        ),
      },
      {
        path: "/articles",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Articles />
          </Suspense>
        ),
      },
      {
        path: "/recipe/about-creator/:id",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <AboutRecipeCreator />
          </Suspense>
        ),
      },
      {
        path: "/*",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Error />
          </Suspense>
        ),
      },

      // Private Routes (Protected)
      {
        element: (
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute />
          </Suspense>
        ),
        children: [
          {
            path: "/reset-password",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <ResetPassword />
              </Suspense>
            ),
          },
          {
            path: "/reset-email",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <ResetEmail />
              </Suspense>
            ),
          },
          {
            path: "/profile/edit",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <EditProfile />
              </Suspense>
            ),
          },
          {
            path: "/settings",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <AccountSettings />
              </Suspense>
            ),
          },
          {
            path: "/my-recipes",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <MyRecipes />
              </Suspense>
            ),
          },
          {
            path: "/add-recipe",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <AddRecipe />
              </Suspense>
            ),
          },
          {
            path: "/bookmarks",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <Bookmarks />
              </Suspense>
            ),
          },
        ],
      },

      // Admin Routes (Protected & Authorized)
      {
        element: (
          <Suspense fallback={<LazyLoader />}>
            <AdminRoute />
          </Suspense>
        ),
        children: [
          {
            path: "/admin/recipe-management",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <RecipeManagement />
              </Suspense>
            ),
          },
          {
            path: "/admin/user-management",
            element: (
              <Suspense fallback={<LazyLoader />}>
                <UserManagement />
              </Suspense>
            ),
          },
          // You can add more admin-only routes here
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement as Element)?.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
);
