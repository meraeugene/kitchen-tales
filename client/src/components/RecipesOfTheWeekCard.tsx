import { useParams, Link } from "react-router-dom";
import { useGetRecipesQuery } from "../slices/recipesApiSlice";
import Loader from "./Loader";
import { ErrorResponse, Recipe } from "../types";
import Rating from "./Rating";
import Message from "./Message";
import { useEffect, useState } from "react";

const RecipesCard = () => {
  const { pageNumber } = useParams();
  const keyword = "";

  const {
    data,
    error: queryError,
    isLoading,
  } = useGetRecipesQuery({
    keyword,
    pageNumber: pageNumber || 1,
  });

  const error = queryError;

  const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (data) {
      // Sort recipes based on numReviews in descending order
      const sortedRecipes = [...data.recipes].sort(
        (a, b) => b.numReviews - a.numReviews,
      );

      // Get the top 3 recipes
      const top3Recipes = sortedRecipes.slice(0, 3);

      // Set the top 3 recipes in the state
      setTopRecipes(top3Recipes);
    }
  }, [data]);

  return (
    <div className="p-8 lg:p-16 xl:px-24">
      {isLoading ? (
        <Loader className="h-full w-full" />
      ) : error ? (
        <Message
          variant="error"
          message={
            (error as ErrorResponse)?.data?.message || "Failed to load recipes"
          }
        />
      ) : (
        <div>
          <h1 className="font-cormorant text-3xl font-medium xl:text-4xl">
            Recipe of the Week
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
            {topRecipes.map((recipe: Recipe) => (
              <div key={recipe.recipeTitle}>
                <iframe
                  src={recipe.videoLink}
                  title={recipe.recipeTitle}
                  allowFullScreen
                  className="h-[250px] w-full"
                />
                <div>
                  <h1 className="title mt-3  text-lg leading-6">
                    <Link to={`/recipe?id=${recipe._id}`}>
                      {recipe.recipeTitle}
                    </Link>
                  </h1>
                  <h3 className="mt-1">
                    By <span className="text-[#C57D5D]">AMANDA SUAREZ</span>
                  </h3>
                  <div className="mb-2 mt-1 flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
};

export default RecipesCard;
