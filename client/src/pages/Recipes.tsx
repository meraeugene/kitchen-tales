import RecipeSection from "../components/RecipeSection";
import RecipesOfTheWeekCard from "../components/RecipesOfTheWeekCard";
import SearchComponent from "../components/SearchComponent";
import Hero from "../sections/Hero";

const Recipes = () => {
  return (
    <div>
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
        title="Morning Delights"
        link="/recipes/tag?=Morning Delights"
        description="      Start your day right! Explore a delightful assortment of breakfast
          wonders, from hearty classics to energizing bites that make each
          morning a delicious celebration."
        tag="Morning Delights"
        className="lg:py-0 "
      />

      <RecipesOfTheWeekCard />

      <RecipeSection
        title="Liquid Harmony"
        link="/recipes/tag?=Liquid Harmony"
        description="Sip, savor, and celebrate! Discover a symphony of fruit-infused delights, refreshing mocktails, and spirited cocktails for every occasion."
        tag="Liquid Harmony"
        className="lg:py-0"
      />

      <RecipeSection
        title="Effortless Eats"
        link="/recipes/tag?=Effortless Eats"
        description="Satisfy your cravings in a flash! Explore our Quick & Easy Meals for effortless recipes without compromising on mouthwatering taste."
        tag="Effortless Eats"
        className="lg:pb-16 lg:pt-16"
      />

      <RecipeSection
        title="Sweet Serenity"
        link="/recipes/tag?=Sweet Serenity"
        description=" Indulge your sweet tooth in a world of delectable desserts. Explore
          heavenly cakes, exquisite pastries, and delightful treats for every
          craving."
        tag="Sweet Serenity"
        className="lg:pb-16 lg:pt-0"
      />

      <RecipeSection
        title="Binge Worthy"
        link="/recipes/tag?=Binge-Worthy"
        description="Elevate your binge-watching experience! Enjoy a variety of savory
          bites, crunchy wonders, and wholesome nibbles—perfect companions for
          your favorite shows."
        tag="Binge-Worthy Bites"
        className="lg:pb-16 lg:pt-0"
      />
    </div>
  );
};

export default Recipes;
