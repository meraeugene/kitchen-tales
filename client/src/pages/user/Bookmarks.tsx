import { Link, useParams } from "react-router-dom";
import {
  useAddToBookmarkMutation,
  useGetBookmarkedRecipesQuery,
  useRemoveFromBookmarkMutation,
} from "../../slices/usersApiSlice";
import { BookmarkRecipes, ErrorResponse, Recipe, RootState } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToBookmark,
  removeFromBookmark,
  removeFromBookmarkData,
  setBookmarkedRecipesData,
} from "../../slices/bookmarkedRecipesSlice";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import Rating from "../../components/Rating";
import Message from "../../components/Message";
import { useEffect } from "react";

const Bookmarks = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { pageNumber } = useParams();

  const dispatch = useDispatch();

  const { data, isLoading } = useGetBookmarkedRecipesQuery({
    pageNumber,
    userId: userInfo?._id,
  });

  const { bookmarkedRecipesData } = useSelector(
    (state: BookmarkRecipes) => state.recipes,
  ) || { bookmarkedRecipesData: [] };

  useEffect(() => {
    if (data) {
      dispatch(setBookmarkedRecipesData(data.bookmarkedRecipes));
    }
  }, [data, dispatch]);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { bookmarkedRecipesID } = useSelector(
    (state: BookmarkRecipes) => state.recipes,
  ) || { bookmarkedRecipesID: [] };

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
      dispatch(removeFromBookmarkData({ recipeId }));
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
    <div className="p-8 lg:px-16 lg:py-12 lg:pb-20 xl:px-24">
      <h1 className="mb-8 font-cormorant text-4xl ">My Bookmarks</h1>
      {isLoading ? (
        <div className="my-24 flex items-center justify-center">
          <l-dot-pulse size="38" speed="1.3" color="green"></l-dot-pulse>
        </div>
      ) : bookmarkedRecipesData.length === 0 ? (
        <Message variant="info" message="You have no bookmarked recipes." />
      ) : (
        <div className="mt-10 grid  grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {bookmarkedRecipesData.map((recipe: Recipe) => (
            <div key={recipe._id}>
              <div className="relative">
                <div>
                  <Link to={`/recipe?id=${recipe._id}&tag=Effortless Eats`}>
                    <img
                      src={recipe.mainImage}
                      alt={recipe.recipeTitle}
                      className="h-[200px] w-full  rounded-[4px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black opacity-10"></div>{" "}
                  </Link>
                </div>

                <button
                  onClick={() => toggleBookmark(recipe._id)}
                  className="absolute right-[10px] top-[10px]"
                >
                  {bookmarkedRecipesID?.includes(recipe._id) ? (
                    <button
                      className="tooltip"
                      data-tip="Remove from Bookmarks"
                    >
                      <FaBookmark size={24} color="#29d343" />
                    </button>
                  ) : (
                    <button className="tooltip" data-tip="Add to Bookmarks">
                      <FaRegBookmark size={24} color="white" />
                    </button>
                  )}
                </button>
              </div>
              <div></div>
              <div>
                <h1 className="title mb-1 mt-3  text-lg font-medium leading-6">
                  {recipe.recipeTitle}
                </h1>
                <Link to={`/recipe/about-creator/${recipe.user._id}`}>
                  By{" "}
                  <span className="text-[#C57D5D]">{recipe.user.fullName}</span>
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
      )}
    </div>
  );
};

export default Bookmarks;
