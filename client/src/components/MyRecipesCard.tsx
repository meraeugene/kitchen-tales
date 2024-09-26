import Rating from "./Rating";
import Message from "./Message";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { Recipe, RootState, ErrorResponse, BookmarkRecipes } from "../types";
import {
  useAddToBookmarkMutation,
  useRemoveFromBookmarkMutation,
} from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToBookmark,
  removeFromBookmark,
} from "../slices/bookmarkedRecipesSlice";
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface MyRecipesProps {
  data: {
    recipes: Recipe[];
  };
  count?: number;
  error?: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
}

const MyRecipesCard = ({ data, count, error, isLoading }: MyRecipesProps) => {
  const handleClick = () => {
    window.scrollTo({ top: 0 });
  };

  const dispatch = useDispatch();

  const { bookmarkedRecipesID } = useSelector(
    (state: BookmarkRecipes) => state.recipes,
  ) || { bookmarkedRecipesID: [] };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [addToBookmarkApi] = useAddToBookmarkMutation();
  const [deleteFromBookmarkApi] = useRemoveFromBookmarkMutation();

  const toggleBookmark = async (recipeId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to bookmark a recipe");
      return;
    }

    // Optimistically toggle the bookmark
    if (!bookmarkedRecipesID.includes(recipeId)) {
      dispatch(addToBookmark({ recipeId }));
    } else {
      dispatch(removeFromBookmark({ recipeId }));
    }

    try {
      if (!bookmarkedRecipesID.includes(recipeId)) {
        const res = await addToBookmarkApi(recipeId).unwrap();
        toast.success(res.message);
      } else {
        await deleteFromBookmarkApi(recipeId).unwrap();
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";
      toast.error(errorMessage);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message
      variant="error"
      message={
        (error as ErrorResponse)?.data?.message || "Failed to load recipes"
      }
    />
  ) : data.recipes?.length > 0 ? (
    <div
      className={`mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`}
    >
      {data?.recipes?.slice(0, count)?.map((recipe: Recipe) => (
        <div key={recipe._id}>
          <div className="relative">
            <div>
              <Link
                to={`/recipe?id=${recipe._id}&tag=Effortless Eats&recipeTitle=${recipe.recipeTitle}`}
              >
                <img
                  src={recipe.mainImage}
                  alt={recipe.recipeTitle}
                  className="h-[200px] w-full  rounded-[4px] object-cover"
                  loading="lazy"
                  onClick={handleClick}
                />
                <div className="absolute inset-0 bg-black opacity-10"></div>{" "}
              </Link>
            </div>

            <button
              onClick={() => toggleBookmark(recipe._id)}
              className="absolute right-[10px] top-[10px]"
            >
              {bookmarkedRecipesID?.includes(recipe._id) ? (
                <FaBookmark size={24} color="#29d343" />
              ) : (
                <FaRegBookmark size={24} color="white" />
              )}
            </button>
          </div>
          <div></div>
          <div>
            <Link
              to={`/recipe?id=${recipe._id}&tag=Effortless Eats&recipeTitle=${recipe.recipeTitle}`}
            >
              <h1 className="title mb-1 mt-3 text-lg leading-6">
                {recipe.recipeTitle}
              </h1>
            </Link>
            <Link
              to={`/recipe/about-creator/${recipe.user._id}`}
              onClick={handleClick}
            >
              By <span className="text-[#C57D5D]">{recipe.user.fullName}</span>
            </Link>

            <div className="mb-2 mt-2 flex flex-wrap items-center gap-2">
              <h6 className="rounded-sm border border-gray-300 px-1 py-[2px] text-sm shadow-sm">
                {recipe.cuisineType}
              </h6>
              <h6 className="rounded-sm border border-gray-300 px-1 py-[2px] text-sm shadow-sm">
                {recipe.dietPreference}{" "}
              </h6>
              <h6 className="rounded-sm border border-gray-300 px-1 py-[2px] text-sm shadow-sm">
                {recipe.mealType}
              </h6>
            </div>
            <h6 className="mb-1 text-sm">
              Total time: {""}
              {recipe.totalTime.hours !== null && (
                <>{`${recipe.totalTime.hours} hours `}</>
              )}
              {recipe.totalTime.minutes} minutes
            </h6>
            <Rating value={recipe.rating} numReviews={recipe.numReviews} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-8">
      <div className=" rounded-[4px] border  border-blue-300 bg-blue-100 px-3 py-4 text-sm  font-normal  text-gray-800 lg:text-lg">
        No recipes found. It looks like you haven't created any recipes yet.
        Click{" "}
        <Link to="/add-recipe" className="font-medium underline">
          here{" "}
        </Link>
        to add recipe .
      </div>
    </div>
  );
};

export default MyRecipesCard;
