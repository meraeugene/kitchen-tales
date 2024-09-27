import { useLocation } from "react-router-dom";
import { useGetRecipeDetailsQuery } from "../slices/recipesApiSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import {
  ErrorResponse,
  Instruction,
  Ingredient,
  BookmarkRecipes,
} from "../types";
import { CiBookmark } from "react-icons/ci";
import { AiOutlinePrinter } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import RecipeTimeComponent from "../components/RecipeTimeComponent";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../types";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import RecipeByTagCard from "../components/RecipeByTagCard";
import {
  useAddToBookmarkMutation,
  useGetUserProfileQuery,
  useRemoveFromBookmarkMutation,
} from "../slices/usersApiSlice";
import {
  addToBookmark,
  removeFromBookmark,
} from "../slices/bookmarkedRecipesSlice";
import ReviewForm from "../components/ReviewForm";
import SocialMediaShareButtons from "../components/SocialMediaShareButtons";
import ReviewsContainer from "../components/ReviewsContainer";
import { ReactToPrint } from "react-to-print";

const RecipeDetails = () => {
  const location = useLocation();
  const recipeId = new URLSearchParams(location.search).get("id");
  const tag = new URLSearchParams(location.search).get("tag");
  const recipeTitle = new URLSearchParams(location.search).get("recipeTitle");
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const scrollToComment = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError,
    refetch,
  } = useGetRecipeDetailsQuery(recipeId);

  const { data: userData, isLoading } = useGetUserProfileQuery({});

  const error = recipeError as ErrorResponse;

  // date
  const originalDate = new Date(recipe?.createdAt);
  const options = { year: "numeric", month: "long", day: "numeric" } as const;
  const formattedDate = originalDate.toLocaleDateString("en-US", options);

  //  user info
  const { userInfo } = useSelector((state: RootState) => state.auth);

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

  const shareUrl = `${import.meta.env.VITE_WEBSITE_URL}/recipe?id=${recipeId}&tag=${tag}&recipeTitle=${recipeTitle}`;
  const encodedUrl = encodeURI(shareUrl);
  const encodedTitle = encodeURIComponent(`${recipeTitle} Recipe`);

  return (
    <div className="p-8 lg:px-16 lg:py-12 xl:px-24">
      {recipeLoading ? (
        <Loader />
      ) : error ? (
        <Message
          variant="error"
          message={error?.data?.message || error.error}
        />
      ) : (
        <div>
          <div className="printable-ref__container" ref={componentRef}>
            <div className="title__container flex flex-col gap-3">
              <h1 className="text-2xl font-semibold md:text-3xl ">
                {recipe.recipeTitle}
              </h1>
              <Rating value={recipe.rating} numReviews={recipe.numReviews} />
              <div className="mt-1">
                <h3 className="text-base">
                  By{" "}
                  <Link to={`/recipe/about-creator/${recipe.user._id}`}>
                    <span className="text-green-800  xl:text-base">
                      {recipe.user.fullName}
                    </span>{" "}
                  </Link>
                  <span>| {formattedDate}</span>
                </h3>
              </div>
            </div>
            <div className="img__container mt-8">
              <img
                src={recipe.mainImage}
                alt={recipe._id}
                className=" print-image w-full rounded-md object-cover lg:max-w-[450px]"
              />
            </div>

            <div className="utils__container print-hide mt-8 flex flex-col justify-between  gap-4 md:flex-row">
              <div className="flex  gap-3">
                <button
                  className="flex items-center gap-[6px] rounded-full "
                  onClick={() => toggleBookmark(recipe._id)}
                >
                  {bookmarkedRecipesID?.includes(recipe._id) ? (
                    // Remove from boookmarks
                    <div className="flex h-[45px] w-full items-center gap-[6px]  rounded-full bg-red-500 px-5 text-white transition-all duration-200  hover:opacity-90">
                      <CiBookmark size={20} />
                      <span className="hidden md:block">
                        {" "}
                        Remove From Bookmarks
                      </span>
                    </div>
                  ) : (
                    // Add to boookmarks
                    <div className=" flex h-[45px]   items-center gap-[6px] rounded-full  border border-gray-700  px-5  transition-all duration-200  hover:bg-green-700 hover:text-white">
                      <CiBookmark size={20} />
                      <span className="hidden md:block">Add To Bookmarks</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={scrollToComment}
                  className="flex h-[45px] items-center gap-[6px] rounded-full border border-gray-700   px-5 transition-all   duration-200  hover:bg-yellow-400 hover:text-black "
                >
                  <CiStar size={20} />
                  <span className="hidden md:block">Rate</span>
                </button>
                <ReactToPrint
                  trigger={() => (
                    <button className="flex h-[45px] items-center gap-[6px] rounded-full border border-gray-700  px-5  transition-all   duration-200  hover:bg-slate-200 hover:text-black">
                      <AiOutlinePrinter size={20} />
                      <span className="hidden md:block"> Print</span>
                    </button>
                  )}
                  content={() => componentRef.current}
                  documentTitle={recipe.recipeTitle}
                />
              </div>

              <SocialMediaShareButtons url={encodedUrl} title={encodedTitle} />
            </div>

            <div className="overview__container print-no-margin mt-8">
              <h1 className=" text-lg font-semibold md:text-2xl">Overview</h1>
              <p className="mt-4 w-full text-sm md:text-base xl:text-lg ">
                {recipe.description}
              </p>
            </div>

            <div className="cooks-tips_container print-hide mt-8">
              <h1 className="text-lg font-semibold md:text-2xl lg:text-3xl">
                Cook Tips
              </h1>

              <div className="print-grid-col-3 mb-16 mt-8 grid  grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 ">
                {recipe.cooksTips.map((tip: string, index: number) => (
                  <div
                    className="rounded-md border p-4 text-sm shadow-md lg:text-base"
                    key={index}
                  >
                    {" "}
                    {tip}
                  </div>
                ))}
              </div>

              <RecipeTimeComponent recipe={recipe} />
            </div>

            <div className="ingredients__container print-no-margin mt-16 ">
              <div className="header flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl lg:text-3xl">
                  Ingredients
                </h1>
                <h1 className="text-base  md:text-lg">
                  METRIC <span className=" text-gray-400">| US</span>
                </h1>
              </div>

              <ul className="ml-8 mt-6 ">
                {recipe.ingredients.map(
                  (ingredient: Ingredient, index: number) => (
                    <li key={index} className="mt-2 list-disc xl:text-lg  ">
                      {ingredient.quantity} {ingredient.measurement}{" "}
                      {ingredient.item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="instructions__container mt-12">
              <h1 className="text-lg font-semibold md:text-2xl lg:text-3xl ">
                Instructions
              </h1>
              {recipe.instructions.map(
                (instruction: Instruction, index: number) => (
                  <div key={instruction._id}>
                    <div className="mt-4 flex flex-col lg:mt-12">
                      <span className=" text-sm font-medium lg:text-xl">
                        {index + 1}.
                      </span>
                      {instruction.image && (
                        <div>
                          <img
                            src={instruction.image}
                            alt={`Step ${index + 1} image`}
                            className="print-image mt-3 h-auto w-full rounded-md object-cover lg:max-h-[450px] xl:h-[350px] xl:w-auto"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <p className="mt-4 text-sm md:text-base lg:text-lg xl:mt-6">
                        {instruction.step}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="video-link__container print-hide mt-12">
            <h1 className=" text-base font-semibold md:text-2xl lg:text-3xl">
              Watch how to make this Recipe
            </h1>
            <iframe
              src={recipe.videoLink}
              title={recipe.recipeTitle}
              allowFullScreen
              className="mt-4 h-auto w-full rounded-md md:h-[400px] lg:mt-8 lg:h-[500px] lg:w-[900px]"
            />
          </div>

          <div className="tags__container mt-12">
            <h1 className="text-xl  font-semibold md:text-2xl  lg:text-3xl">
              Tags
            </h1>
            <div className=" mt-8 flex flex-wrap items-center gap-3">
              {recipe.tags.map((tag: string, index: number) => (
                <div
                  className="rounded-full border  px-4 py-2 text-sm shadow-sm xl:text-base"
                  key={index}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div ref={commentSectionRef} className="reviews__container mt-12">
            <h1 className=" mb-2 text-xl font-semibold  md:text-2xl lg:text-3xl">
              Reviews ({recipe.numReviews})
            </h1>
            <div className="flex items-center gap-2">
              <div>
                <Rating value={recipe.rating} />
              </div>
              <h1 className="text-lg">{recipe.rating.toFixed(1)}</h1>
            </div>

            {userInfo ? (
              <div className="review__container lg:gray-100 mt-6 rounded-sm pb-6 pt-4 md:rounded-md md:bg-gray-100 md:pb-8 md:pl-4 md:pr-6 md:pt-6 lg:px-5 2xl:w-1/2">
                <div className=" flex flex-col gap-4 md:flex-row  md:gap-0">
                  <div className="basis-[10%] lg:basis-[8%] xl:basis-[6%] 2xl:basis-[7%]">
                    {isLoading ? (
                      <l-tailspin
                        size="20"
                        stroke="3.5"
                        speed="1"
                        color="black"
                      ></l-tailspin>
                    ) : (
                      <img
                        src={userData?.image}
                        alt={userData?.fullName}
                        className="h-[40px] w-[40px] cursor-pointer rounded-full object-cover md:h-[35px] md:w-[35px]"
                      />
                    )}
                  </div>
                  <div className="basis-full">
                    <ReviewForm recipeId={recipeId} refetch={refetch} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 inline-block rounded-[4px]  border border-blue-300 bg-blue-100 px-3 py-4  text-sm  font-normal text-gray-800 lg:text-lg">
                Please{" "}
                <Link to="/auth/login" className="underline">
                  login
                </Link>{" "}
                to submit a review.
              </div>
            )}

            {recipe.reviews.length > 0 && userInfo?._id && (
              <ReviewsContainer userId={userInfo._id} recipe={recipe} />
            )}
          </div>

          <div className="recipes-love__container mb-10 mt-20">
            <h1 className="text-2xl font-semibold lg:text-3xl">
              Recipes You'll Love
            </h1>

            <RecipeByTagCard tag={tag} count={5} currentRecipeId={recipeId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
