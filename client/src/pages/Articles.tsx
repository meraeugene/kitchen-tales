import ArticlesCard from "../components/ArticlesCard";
import ContentSection from "../components/ContentSection";

const Articles = () => {
  return (
    <div className="pb-8 md:pb-0 md:pt-8  lg:pt-16 xl:pb-24 xl:pt-0 ">
      <ContentSection
        title="Healthy Eating Inspiration"
        image="/images/healthy.png"
        altText="healthy"
        sections={[
          {
            header: "Delicious Dishes Packed with Nutrition",
            description:
              "Explore a collection of mouthwatering recipes that not only delight your taste buds but also pack a powerful nutritional punch.",
          },
          {
            header: "Fuel Your Day with Plant-Based Power",
            description:
              "Dive into the world of plant-based goodness with recipes that provide both energy and exceptional flavors, making each bite a celebration of health.",
          },
          {
            header: "One-Pan Wonders for Stress-Free Cooking",
            description:
              "Simplify your culinary journey with stress-free, one-pan wonders—recipes that prioritize convenience without compromising on nutritional value or taste.",
          },
        ]}
      />

      <ArticlesCard
        header="International Flavor Showcase"
        title="International Flavor Showcase"
      />

      <ContentSection
        title="Comfort Classics"
        image="/images/comfort.png"
        altText="comfort classics"
        sections={[
          {
            header: "Homemade Comfort Creations to Warm Your Soul",
            description:
              "Craft comforting dishes from scratch and transform your kitchen into a haven of warmth and deliciousness.",
          },
          {
            header: "One-Pot Wonders: Effortless Comfort in Every Bite",
            description:
              "Simplify mealtime with these heartwarming one-pot wonders. Enjoy the ease and comfort of flavorful dishes cooked in a single pot.",
          },
          {
            header: "Flavorful Innovations: Modern Twists on Comfort Tradition",
            description:
              "Infuse a burst of contemporary flavors into beloved classics. Explore inventive recipes for a modern take on comforting traditions.",
          },
        ]}
      />

      <ArticlesCard header="More Articles" title="More Articles" />
    </div>
  );
};

export default Articles;
