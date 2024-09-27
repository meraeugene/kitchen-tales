import { useParams } from "react-router-dom";
import { useGetRecipesByTagQuery } from "../slices/recipesApiSlice";
import Loader from "./Loader";
import {
  ErrorResponse,
  Recipe,
  RecipeByTagProps,
  BookmarkRecipes,
  RootState,
} from "../types";
import Rating from "./Rating";
import Message from "./Message";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import {
  removeFromBookmark,
  addToBookmark,
} from "../slices/bookmarkedRecipesSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToBookmarkMutation,
  useRemoveFromBookmarkMutation,
} from "../slices/usersApiSlice";

const RecipeByTagCard = ({ tag, count, currentRecipeId }: RecipeByTagProps) => {
  const { pageNumber } = useParams();
  const keyword = "";

  const dispatch = useDispatch();

  const { bookmarkedRecipesID } = useSelector(
    (state: BookmarkRecipes) => state.recipes,
  ) || { bookmarkedRecipesID: [] };

  const {
    data,
    error: queryError,
    isLoading,
  } = useGetRecipesByTagQuery({
    keyword,
    tag,
    pageNumber: pageNumber || 1,
  });

  const error = queryError as ErrorResponse;

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const handleClick = () => {
    window.scrollTo({ top: 0 });
  };

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

  return (
    <>
      {isLoading ? (
        <Loader className="h-full w-full" />
      ) : error ? (
        <div className="mt-6">
          <Message
            variant="info"
            message={error?.data?.message || error.error}
          />
        </div>
      ) : (
        <div>
          <div
            className={` mt-8  grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`}
          >
            {data?.recipes
              .filter((recipe: Recipe) => recipe._id !== currentRecipeId) // Filter out the current recipe
              .slice(0, count)
              .map((recipe: Recipe) => (
                <div key={recipe._id}>
                  <div className="relative  ">
                    <div>
                      <Link
                        to={`/recipe?id=${recipe._id}&tag=${tag}&recipeTitle=${recipe.recipeTitle}`}
                        onClick={handleClick}
                      >
                        <img
                          src={recipe.mainImage}
                          alt={recipe.recipeTitle}
                          className="h-[200px]   w-full  rounded-[4px] object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black opacity-10"></div>{" "}
                      </Link>
                    </div>

                    <button
                      onClick={() => toggleBookmark(recipe._id)}
                      className="  absolute right-[10px] top-[10px]"
                    >
                      {bookmarkedRecipesID?.includes(recipe._id) ? (
                        <div
                          className="lg:tooltip"
                          data-tip="Remove from Bookmarks"
                        >
                          <FaBookmark size={24} color="#29d343" />
                        </div>
                      ) : (
                        <div className="lg:tooltip" data-tip="Add to Bookmarks">
                          <FaRegBookmark size={24} color="white" />
                        </div>
                      )}
                    </button>
                  </div>

                  <div>
                    <Link
                      to={`/recipe?id=${recipe._id}&tag=${tag}&recipeTitle=${recipe.recipeTitle}`}
                    >
                      <h1 className="title mb-1 mt-3 text-lg leading-6">
                        {recipe.recipeTitle}
                      </h1>
                    </Link>

                    <Link to={`/recipe/about-creator/${recipe.user._id}`}>
                      By{" "}
                      <span className="text-green-800  xl:text-base">
                        {recipe.user.fullName}
                      </span>
                    </Link>

                    <div className="mb-2 mt-2 flex flex-wrap items-center gap-2">
                      <h6 className="rounded-sm border border-gray-200 px-1 py-[2px] text-sm shadow-sm xl:px-[.30rem] xl:text-base">
                        {recipe.cuisineType}
                      </h6>
                      <h6 className="rounded-sm border border-gray-200 px-1 py-[2px] text-sm shadow-sm xl:px-[.30rem] xl:text-base">
                        {recipe.dietPreference}{" "}
                      </h6>
                      <h6 className="rounded-sm border border-gray-200 px-1 py-[2px] text-sm shadow-sm xl:px-[.30rem] xl:text-base">
                        {recipe.mealType}
                      </h6>
                    </div>
                    <h6 className="mb-1 text-sm lg:text-base">
                      Cooking time: {""}
                      {recipe.cookTime.hours !== null && (
                        <>{`${recipe.cookTime.hours} hours `}</>
                      )}
                      {recipe.cookTime.minutes} minutes
                    </h6>
                    <Rating
                      value={recipe.rating}
                      numReviews={recipe.numReviews}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeByTagCard;
