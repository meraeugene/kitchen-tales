// Import other modules as usual
import dotenv from "dotenv";
import { bgGreen, bgRed } from "colorette";

// Data
import users from "./data/users";
import recipes from "./data/recipes";
import cuisines from "./data/cuisines";
import articles from "./data/articles";

// Models
import Recipe from "./models/recipeModel";
import User from "./models/userModel";
import Cuisines from "./models/cuisinesModel";
import Article from "./models/articleModel";

import connectDb from "./config/db";

dotenv.config();

connectDb();

const importData = async () => {
  try {
    await Cuisines.deleteMany();
    await Recipe.deleteMany();
    await User.deleteMany();
    await Article.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUserId = createdUsers[0]._id;
    const sampleRecipes = recipes.map((recipe) => {
      return { ...recipe, user: adminUserId };
    });
    const sampleCuisines = cuisines.map((cuisine) => {
      return { ...cuisine, user: adminUserId };
    });

    await Recipe.insertMany(sampleRecipes);
    await Cuisines.insertMany(sampleCuisines);
    await Article.insertMany(articles);

    console.log(bgGreen("Data Imported!"));
    process.exit();
  } catch (error) {
    console.log(bgRed(`${error}`));
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Recipe.deleteMany();
    await Cuisines.deleteMany();
    await User.deleteMany();
    await Article.deleteMany();

    console.log(bgRed("Data Destroyed"));
    process.exit();
  } catch (error) {
    console.log(bgRed(`${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
