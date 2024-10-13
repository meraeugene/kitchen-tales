import { IoIosSearch } from "react-icons/io";
import { useGetRecipesQuery } from "../slices/recipesApiSlice";
import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Recipe } from "../types";

interface SearchProps {
  className?: string;
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchComponent = ({ className }: SearchProps) => {
  const [keyword, setKeyword] = useState("");
  const { pageNumber } = useParams();

  // Debounce search updates
  const debouncedSearch = useMemo(() => debounce(setKeyword, 100), []);

  const { data } = useGetRecipesQuery({
    keyword,
    pageNumber,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  return (
    <form className=" sticky top-[50px] z-[5]">
      <div className={`${className} relative h-12 focus-within:shadow-lg`}>
        <IoIosSearch
          color="#121212"
          size={22}
          className="absolute left-[14px] top-[14px]"
        />

        <input
          className={`peer h-full w-full pl-12 pr-4 text-gray-700 outline-none md:rounded-3xl ${keyword ? "md:rounded-bl-none md:rounded-br-none" : ""}`}
          type="search"
          id="search"
          placeholder="Search a recipe..."
          onChange={handleSearch}
          aria-label="Search recipes"
        />

        {keyword && data?.recipes && (
          <div className="absolute left-0 top-[35px] mt-2 max-h-[170px] w-full overflow-auto rounded-md rounded-tl-none rounded-tr-none border border-gray-300 bg-white text-left text-black shadow-lg md:max-h-[170px] lg:top-[40px] xl:max-h-[205px] 2xl:max-h-[205px]">
            {data.recipes.map((recipe: Recipe) => (
              <Link
                to={`/recipe?id=${recipe._id}&tag=Effortless Eats&recipeTitle=${recipe.recipeTitle}`}
                key={recipe._id}
              >
                <div className="px-4 py-2 pl-12 text-base hover:bg-slate-100">
                  {recipe.recipeTitle}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchComponent;
