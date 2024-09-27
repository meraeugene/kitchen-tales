import { FC } from "react";
import { Link } from "react-router-dom";
import RecipeByTagCard from "./RecipeByTagCard";

interface RecipeSectionProps {
  title: string;
  link: string;
  description: string;
  tag: string;
  className?: string;
}

const RecipeSection: FC<RecipeSectionProps> = ({
  title,
  link,
  description,
  tag,
  className,
}) => (
  <div
    className={`${className} recipe-section__container  p-8 lg:px-16 xl:px-24 `}
  >
    <div className="flex flex-col justify-between md:flex-row">
      <h1 className="font-cormorant text-3xl xl:text-4xl">{title}</h1>
      <Link to={link} className="text-green-800 xl:text-lg">
        VIEW ALL RECIPES &gt;
      </Link>
    </div>
    <p className="mt-2 text-sm text-[#444444] lg:w-[60%] xl:text-lg">
      {description}
    </p>
    <RecipeByTagCard tag={tag} count={5} />
  </div>
);

export default RecipeSection;
