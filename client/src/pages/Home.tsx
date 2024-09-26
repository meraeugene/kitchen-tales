import ArticlesCard from "../components/ArticlesCard";
import RecipeSection from "../components/RecipeSection";
import RecipeOfTheWeekCard from "../components/RecipesOfTheWeekCard";
import SearchComponent from "../components/SearchComponent";
import Hero from "../sections/Hero";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="xl:pb-24">
      <Hero />

      <SearchComponent className="border border-gray-200 bg-white md:hidden" />

      <RecipeSection
        title="Newest Recipe"
        link="/recipes/tag?=Newest Recipe"
        description="Unleash your culinary creativity with our newest recipes, featuring innovative flavors and fresh ideas for every occasion!"
        tag="Newest Recipe"
        className="lg:py-16 "
      />

      <RecipeSection
        title="Effortless Eats"
        link="/recipes/tag?=Effortless Eats"
        description="Satisfy your cravings in a flash! Explore our Quick & Easy Meals for effortless recipes without compromising on mouthwatering taste."
        tag="Effortless Eats"
        className="lg:pb-16 lg:pt-0"
      />

      <div className="healthy-eating-inspiration__container p-8 lg:p-16 lg:pt-0 xl:px-24">
        <div className="flex flex-col justify-between md:flex-row">
          <h1 className="font-cormorant text-2xl font-medium md:text-3xl xl:text-4xl">
            Healthy Eating Inspiration
          </h1>
          <Link to="/articles" className="text-green-800 xl:text-lg">
            VIEW ALL &gt;
          </Link>
        </div>

        <div className="mt-8 flex h-full flex-col gap-8 lg:flex-row">
          <div className="basis-1/2">
            <img
              src="/images/healthy.png"
              alt="healthy"
              loading="lazy"
              className="h-full rounded-[4px] object-cover"
            />
          </div>
          <div className="content basis-1/2">
            <div className="flex h-full flex-col gap-8">
              {[
                {
                  title: "Delicious Dishes Packed with Nutrition",
                  description:
                    "Explore a collection of mouthwatering recipes that not only delight your taste buds but also pack a powerful nutritional punch.",
                },
                {
                  title: "Fuel Your Day with Plant-Based Power",
                  description:
                    "Dive into the world of plant-based goodness with recipes that provide both energy and exceptional flavors, making each bite a celebration of health.",
                },
                {
                  title: "One-Pan Wonders for Stress-Free Cooking",
                  description:
                    "Simplify your culinary journey with stress-free, one-pan wonders—recipes that prioritize convenience without compromising on nutritional value or taste.",
                },
              ].map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h1 className="mb-1 text-xl lg:text-xl">{section.title}</h1>
                  <p className="text-sm text-[#444444] xl:text-base">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RecipeSection
        title="Liquid Harmony"
        link="/recipes/tag?=Liquid Harmony"
        description="Sip, savor, and celebrate! Discover a symphony of fruit-infused delights, refreshing mocktails, and spirited cocktails for every occasion."
        tag="Liquid Harmony"
        className="lg:py-0"
      />

      <RecipeOfTheWeekCard />

      <ArticlesCard
        header="International Flavor Showcase"
        title="International Flavor Showcase"
      />
    </div>
  );
};

export default Home;
