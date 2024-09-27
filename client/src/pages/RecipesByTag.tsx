import { memo, useEffect } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import SearchComponent from "../components/SearchComponent";
import { descriptionByTag } from "../data/descriptionsByTags";
import { useState } from "react";
import { IoAdd, IoCloseOutline, IoOptionsOutline } from "react-icons/io5";
import { FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetRecipesByTagQuery } from "../slices/recipesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { BookmarkRecipes, ErrorResponse, Recipe } from "../types";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBookmark,
  removeFromBookmark,
} from "../slices/bookmarkedRecipesSlice";
import {
  useAddToBookmarkMutation,
  useRemoveFromBookmarkMutation,
} from "../slices/usersApiSlice";

const RecipesByTag = memo(() => {
  const location = useLocation();
  const tag = new URLSearchParams(location.search).get("");
  const [mobileNav, setMobileNav] = useState(false);

  const { pageNumber } = useParams();
  const keyword = "";

  const [searchParams, setSearchParams] = useSearchParams({
    sort: "Newest",
    cuisineType: "",
    dietPreference: "",
    mealType: "",
    cookTime: "",
  });

  const sort = searchParams.get("sort") ?? "Newest";
  const cuisineType = searchParams.get("cuisineType") || "";
  const dietPreference = searchParams.get("dietPreference") || "";
  const mealType = searchParams.get("mealType") || "";
  const cookTime = searchParams.get("cookTime") || "";

  // const handleLoadMore = () =>
  //   page < data?.pages && setPage((prevPage) => prevPage + 1);

  // Function to handle sort change
  const handleSortChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSearchParams(
      (prev) => {
        prev.set("sort", event.target.value);
        return prev;
      },
      { replace: true },
    );
  };

  const selectedDescription = descriptionByTag.find((desc) => desc.tag === tag);
  const tagDescription = selectedDescription
    ? selectedDescription.description
    : "";

  const [accordionState, setAccordionState] = useState({
    cuisine: false,
    diet: false,
    mealType: false,
    cookingTime: false,
  });

  const cuisineTypes = [
    "Italian",
    "Mexican",
    "Indian",
    "Asian",
    "Mediterranean",
    "Middle Eastern",
    "African",
    "French",
    "American",
    "Cajun",
    "Beverage",
    "Global",
  ];

  const dietTypes = [
    "Vegetarian",
    "Vegan",
    "Keto",
    "Paleo",
    "Low Carb",
    "High Protein",
    "Regular",
    "Eggless",
  ];

  const mealTypes = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Snacks",
    "Desserts",
    "Appetizer",
    "Side Dish",
    "Salad",
    "Soup",
    "Main Course",
    "Beverage",
    "Drink",
  ];

  const cookingTimes = ["5 minutes below", "6-10 minutes", "15 minutes above"];

  const {
    data,
    error: queryError,
    isLoading,
  } = useGetRecipesByTagQuery({
    keyword,
    tag,
    pageNumber: pageNumber || 1,
    sort,
    cuisineType,
    dietPreference,
    mealType,
    cookTime,
  });

  const error = queryError;

  const dispatch = useDispatch();

  const { bookmarkedRecipesID } = useSelector(
    (state: BookmarkRecipes) => state.recipes,
  ) || { bookmarkedRecipesID: [] };

  const [addToBookmarkApi] = useAddToBookmarkMutation();
  const [deleteFromBookmarkApi] = useRemoveFromBookmarkMutation();

  const toggleBookmark = async (recipeId: string) => {
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

  const toggleNav = () => {
    setMobileNav(!mobileNav);
  };

  // Effect to automatically turn mobile nav on for screens greater than 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileNav(true); // Enable mobile nav when screen is larger than 1024px
      } else {
        setMobileNav(false); // Disable mobile nav when screen is smaller
      }
    };

    // Check screen size on initial load
    handleResize();

    // Add event listener to monitor resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="pb-16 lg:pb-0">
        <div className="search-bar__container bg-[#2E5834]  px-8 py-4 text-white  md:py-8 lg:px-16 lg:pb-14 lg:pt-8 xl:px-24 2xl:px-24">
          <div className="flex items-center gap-2">
            <Link to="/">Home</Link>
            <span>&gt;</span>
            <Link to="/recipes">Recipes</Link>
          </div>
          <div className="mx-auto mt-4 hidden w-1/2 md:block md:w-full lg:w-[70%] xl:w-1/2  ">
            <SearchComponent />
          </div>
        </div>

        <SearchComponent className="border border-gray-200 bg-white md:hidden  " />

        <div className="recipe-tag-description__container flex flex-col items-center justify-center gap-3 px-8 py-12">
          <h1 className="font-cormorant text-3xl font-medium md:text-4xl">
            {tag}
          </h1>
          <p className="w-full  text-center text-sm lg:w-[65%] xl:w-[45%] xl:text-base 2xl:w-[40%]">
            {tagDescription}
          </p>
        </div>

        <div className="flex justify-between lg:gap-12">
          {mobileNav && (
            <div className="slide-in-left nav-color fixed left-0 top-0 z-30  h-screen w-[60%]  md:w-1/2 lg:static lg:z-0 lg:h-full xl:w-[30%] 2xl:w-[20%]">
              <button
                onClick={toggleNav}
                className="absolute left-[25px] top-[20px] lg:hidden"
              >
                <IoCloseOutline size={30} />
              </button>
              <div className="filter__container basis-[19%] p-8 pt-20 lg:block lg:pl-16 lg:pt-0 xl:pl-24">
                <h1 className="mb-8 font-cormorant text-3xl  font-medium ">
                  FILTER BY
                </h1>
                {/* CUISINE TYPES */}
                <div
                  className="flex cursor-pointer items-center justify-between border-b border-t py-4"
                  onClick={() =>
                    setAccordionState((prevState) => ({
                      ...prevState,
                      cuisine: !prevState.cuisine,
                    }))
                  }
                >
                  <h2 className=" font-medium">Cuisine Types</h2>
                  <span>
                    {accordionState.cuisine ? (
                      <FiMinus size={20} />
                    ) : (
                      <IoAdd size={20} />
                    )}
                  </span>
                </div>
                <div
                  className={`flex flex-col gap-2 py-3  ${
                    accordionState.cuisine ? "showAccordion" : "accordionHidden"
                  }`}
                >
                  {cuisineTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center justify-between"
                    >
                      {type}
                      <input
                        type="checkbox"
                        name="cuisineType"
                        checked={cuisineType === type}
                        onChange={() =>
                          setSearchParams(
                            (prev) => {
                              const newCuisineType =
                                cuisineType === type ? "" : type; // Toggle the value
                              prev.set("cuisineType", newCuisineType);
                              return prev;
                            },
                            { replace: true },
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
                {/* DIET PREFERENCE */}
                <div
                  className="flex cursor-pointer items-center justify-between border-b  py-4"
                  onClick={() =>
                    setAccordionState((prevState) => ({
                      ...prevState,
                      diet: !prevState.diet,
                    }))
                  }
                >
                  <h2 className="  font-medium">Diet Preference</h2>
                  <span>
                    {accordionState.diet ? (
                      <FiMinus size={20} />
                    ) : (
                      <IoAdd size={20} />
                    )}
                  </span>
                </div>
                <div
                  className={`flex flex-col gap-2  py-3 ${
                    accordionState.diet ? "showAccordion" : "accordionHidden"
                  }`}
                >
                  {dietTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center justify-between"
                    >
                      {type}
                      <input
                        type="checkbox"
                        name="dietPreference"
                        checked={dietPreference === type}
                        onChange={() =>
                          setSearchParams(
                            (prev) => {
                              const newDietPreference =
                                dietPreference === type ? "" : type; // Toggle the value
                              prev.set("dietPreference", newDietPreference);
                              return prev;
                            },
                            { replace: true },
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
                {/* MEAL TYPE */}
                <div
                  className="flex cursor-pointer items-center justify-between border-b  py-4"
                  onClick={() =>
                    setAccordionState((prevState) => ({
                      ...prevState,
                      mealType: !prevState.mealType,
                    }))
                  }
                >
                  <h2 className=" font-medium">Meal Type</h2>
                  <span>
                    {accordionState.mealType ? (
                      <FiMinus size={20} />
                    ) : (
                      <IoAdd size={20} />
                    )}
                  </span>
                </div>
                <div
                  className={`flex flex-col gap-2 py-3 ${
                    accordionState.mealType
                      ? "showAccordion"
                      : "accordionHidden"
                  }`}
                >
                  {mealTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center justify-between"
                    >
                      {type}
                      <input
                        type="checkbox"
                        name="mealType"
                        checked={mealType === type}
                        onChange={() =>
                          setSearchParams(
                            (prev) => {
                              const newMealType = mealType === type ? "" : type; // Toggle the value
                              prev.set("mealType", newMealType);
                              return prev;
                            },
                            { replace: true },
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
                {/* COOKING TIME */}
                <div
                  className="flex cursor-pointer items-center justify-between border-b  py-4"
                  onClick={() =>
                    setAccordionState((prevState) => ({
                      ...prevState,
                      cookingTime: !prevState.cookingTime,
                    }))
                  }
                >
                  <h2 className=" font-medium">Cooking Time</h2>
                  <span>
                    {accordionState.cookingTime ? (
                      <FiMinus size={20} />
                    ) : (
                      <IoAdd size={20} />
                    )}
                  </span>
                </div>{" "}
                <div
                  className={`flex flex-col gap-2  py-3 ${
                    accordionState.cookingTime
                      ? "showAccordion"
                      : "accordionHidden"
                  }`}
                >
                  {cookingTimes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center justify-between"
                    >
                      {type}
                      <input
                        type="checkbox"
                        name="cookTime"
                        checked={cookTime === type}
                        onChange={() =>
                          setSearchParams(
                            (prev) => {
                              const newCookingTime =
                                cookTime === type ? "" : type; // Toggle the value
                              prev.set("cookTime", newCookingTime);
                              return prev;
                            },
                            { replace: true },
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="recipes-by-tag__container basis-full  p-8  lg:basis-[80%] lg:p-0 lg:pb-16 lg:pr-16">
            <div className="mb-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-center ">
              <h1 className="hidden font-cormorant text-3xl font-medium lg:block">
                {`${sort}  ${cuisineType ? ` | ${cuisineType}` : ""}${dietPreference ? ` | ${dietPreference}` : ""}${cookTime ? ` | ${cookTime}` : ""}${mealType ? ` | ${mealType}` : ""}`}
              </h1>

              <div className="flex items-center justify-end gap-2 ">
                <div>
                  <select
                    name=""
                    id=""
                    className="rounded-sm  border border-gray-200 px-2 py-1 shadow-sm"
                    value={sort}
                    onChange={handleSortChange}
                  >
                    <option value="Newest">Newest</option>
                    <option value="Most-Reviewed">Most Reviewed</option>
                    <option value="Highest-Rated">Highest Rated</option>
                  </select>
                </div>

                <button
                  className="flex items-center gap-2  rounded-sm border  border-gray-200  px-2 py-1 shadow-sm lg:hidden "
                  onClick={toggleNav}
                >
                  <span>Filter </span>
                  <IoOptionsOutline />
                </button>
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message
                variant="info"
                message={
                  (error as ErrorResponse)?.data?.message ||
                  "Failed to load recipes"
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {data?.recipes?.map((recipe: Recipe) => (
                  <div key={recipe._id}>
                    <div className="relative">
                      <div>
                        <Link
                          to={`/recipe?id=${recipe._id}&tag=${tag}&recipeTitle=${recipe.recipeTitle}`}
                        >
                          <img
                            src={recipe.mainImage}
                            alt={recipe.recipeTitle}
                            className="h-[200px] w-full  rounded-[4px] object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black opacity-10"></div>{" "}
                        </Link>
                      </div>

                      <div className="absolute right-[10px] top-[10px]">
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
                        <span className="text-[#C57D5D]">
                          {recipe.user.fullName}
                        </span>
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
            )}

            {/* {page < data?.pages &&
              !isFetching &&
              data.recipes.length !== 0 &&
              !error && (
                <div className="mt-14 text-center">
                  <button
                    className="rounded-md bg-[#2E5834] px-5 py-2 text-white"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
});

export default RecipesByTag;
