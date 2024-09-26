import MyRecipesCard from "../../components/MyRecipesCard";
import { useGetMyRecipesQuery } from "../../slices/recipesApiSlice";
// import { useState } from "react";
import { useParams } from "react-router-dom";
import { RootState } from "../../types";
import { useSelector } from "react-redux";
import Aside from "../../components/Aside";

const MyRecipes = () => {
  // const [keyword, setKeyword] = useState("");

  const { pageNumber } = useParams();

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const _id = userInfo?._id; // Optional chaining to safely access _id

  const { data, isLoading, error } = useGetMyRecipesQuery({
    // keyword,
    pageNumber,
    id: _id,
  });

  const links = [
    { to: "/profile/edit", label: "Edit Your Profile" },
    { to: "/settings", label: "Account Settings" },
    { to: "/my-recipes", label: "My Recipes", isActive: true },
  ];

  return (
    <div className="flex">
      <Aside title="My Profile" links={links} />

      <main className="basis-full p-8 lg:basis-[85%] lg:px-14 lg:pb-12 lg:pt-8">
        <div className="header">
          <h1 className=" border-b border-gray-300 pb-4 text-2xl font-semibold">
            My Recipes
          </h1>

          <MyRecipesCard data={data} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default MyRecipes;
