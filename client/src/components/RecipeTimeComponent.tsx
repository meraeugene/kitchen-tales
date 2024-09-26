interface RecipeTimeComponentProps {
  recipe: {
    preparationTime: { hours: number; minutes: number };
    cookTime: { hours: number; minutes: number };
    totalTime: { hours: number; minutes: number };
    servings: number;
  };
}

const RecipeTimeComponent: React.FC<RecipeTimeComponentProps> = ({
  recipe,
}) => {
  return (
    <div className="print-row   flex w-full flex-col items-center justify-between rounded-md bg-gray-100 md:mt-16 md:flex-row lg:mx-auto lg:w-[90%]  ">
      <div className="print-prep-time  flex w-full basis-[25%] flex-col items-center justify-center border-gray-300 px-10 py-12  md:border-r ">
        <img
          src="/images/prep.svg"
          alt=""
          loading="lazy"
          className="print-custom-width w-[40px] object-cover"
        />
        <h1 className="mt-2 font-semibold">Prep Time</h1>
        <h2>
          {recipe.preparationTime.hours !== null && (
            <>{`${recipe.preparationTime.hours} hours `}</>
          )}
          {recipe.preparationTime.minutes} minutes
        </h2>
      </div>
      <div className="print-cook-time flex w-full basis-[25%] flex-col items-center justify-center border-t  border-gray-300 px-10 py-12 md:border-r md:border-t-0">
        <img
          src="/images/cook.svg"
          alt=""
          loading="lazy"
          className="print-custom-width w-[40px] object-cover "
        />
        <h1 className="mt-2 font-semibold">Cook Time</h1>
        <h2 className="text-center">
          {recipe.cookTime.hours !== null && (
            <>{`${recipe.cookTime.hours} hours `}</>
          )}
          {recipe.cookTime.minutes} minutes
        </h2>
      </div>
      <div className="print-total-time flex w-full basis-[25%] flex-col items-center justify-center  border-t border-gray-300 px-10 py-12 md:border-r md:border-t-0">
        <img
          src="/images/total.svg"
          alt=""
          loading="lazy"
          className="print-custom-width w-[40px] object-cover"
        />
        <h1 className="mt-2 font-semibold">Total Time</h1>
        <h2 className="text-center">
          {recipe.totalTime.hours !== null && (
            <>{`${recipe.totalTime.hours} hour `}</>
          )}
          {recipe.totalTime.minutes !== null && (
            <>{`${recipe.totalTime.minutes} minutes `}</>
          )}
        </h2>
      </div>
      <div className="print-servings-time flex w-full basis-[25%] flex-col items-center justify-center  border-t border-gray-300 px-10  py-12 md:border-t-0">
        <img
          src="/images/serve.svg"
          alt=""
          loading="lazy"
          className="print-custom-width w-[40px] object-cover"
        />
        <h1 className="mt-2 font-semibold">Servings</h1>
        <h2>{recipe.servings}</h2>
      </div>
    </div>
  );
};

export default RecipeTimeComponent;
