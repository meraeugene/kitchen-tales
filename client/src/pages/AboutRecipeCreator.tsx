import { useParams } from "react-router-dom";
import { useGetUserDetailsQuery } from "../slices/usersApiSlice";
import { IoIosArrowRoundBack } from "react-icons/io";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import MyRecipesCard from "../components/MyRecipesCard";
import { useGetMyRecipesQuery } from "../slices/recipesApiSlice";
import { IoLocationOutline } from "react-icons/io5";
import Loader from "../components/Loader";
import { ErrorResponse } from "../types";

const AboutRecipeCreator = () => {
  const { id } = useParams();
  const {
    data: recipeCreator,
    isLoading,
    error: recipeCreatorError,
  } = useGetUserDetailsQuery(id);

  const error = recipeCreatorError;

  const { pageNumber } = useParams();

  const {
    data,
    isLoading: loadingMyRecipes,
    error: errorMyRecipes,
  } = useGetMyRecipesQuery({
    pageNumber,
    id,
  });

  const myRecipesError = errorMyRecipes;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message
          variant="info"
          message={
            (error as ErrorResponse)?.data?.message ||
            "Failed to load creator recipe details"
          }
        />
      ) : (
        <div className="p-8 lg:px-16 lg:pb-20 lg:pt-10 xl:px-24">
          <div className="flex flex-col  gap-10">
            <Link to="/">
              <IoIosArrowRoundBack
                size={34}
                className="rounded-full transition-all duration-200 hover:bg-gray-200"
              />
            </Link>
            <div className="content__container flex flex-col gap-10">
              <div className="header__container flex flex-col  gap-8">
                <img
                  src={recipeCreator.image}
                  className="h-[200px] w-[200px] rounded-md  object-cover"
                  alt={recipeCreator.fullName}
                  loading="lazy"
                />

                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-medium">
                    {recipeCreator.fullName}
                  </h1>
                  <div className="flex items-center gap-1">
                    <IoLocationOutline size={20} />
                    <h1>{recipeCreator.address}</h1>
                  </div>
                  <div className="social-icons__container mt-2 flex gap-2">
                    <img
                      src="/images/socials/fb.svg"
                      alt="fb"
                      className="h-[35px] w-[35px] rounded-full border border-gray-400 object-cover p-1"
                      loading="lazy"
                    />
                    <img
                      src="/images/socials/ig.svg"
                      alt="fb"
                      className="h-[35px] w-[35px] rounded-full border border-gray-400 object-cover p-1"
                      loading="lazy"
                    />
                    <img
                      src="/images/socials/twitter.svg"
                      alt="fb"
                      className="h-[35px] w-[35px] rounded-full border border-gray-400 object-cover p-1"
                      loading="lazy"
                    />
                    <img
                      src="/images/socials/linkedin.svg"
                      alt="fb"
                      className="h-[35px] w-[35px] rounded-full border border-gray-400 object-cover p-1"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <p className="lg:w-[80%]">{recipeCreator.aboutMe}</p>

              <div className="more-from-creator__container mt-8">
                <h1 className="text-xl font-medium lg:text-3xl">
                  More from {recipeCreator.fullName}
                </h1>
                <MyRecipesCard
                  count={5}
                  data={data}
                  isLoading={loadingMyRecipes}
                  error={myRecipesError}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutRecipeCreator;
