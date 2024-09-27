import asyncHandler from "../middlewares/asyncHandler";
import Recipe from "../models/recipeModel";
import Cuisines from "../models/cuisinesModel";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { buildFilterQuery } from "../utils/buildFilterQuery";
import { findReply, Reply, Review } from "../utils/findReply";

export interface AuthenticatedRequest extends Request {
  userCredentials: {
    user: string;
    _id: string;
    isAdmin: boolean;
    fullName: string;
    email: string;
    image: string;
  };
}

// @desc Fetch all recipes
// @route GET /api/recipes
// @access Public
const getRecipes = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? { recipeTitle: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Recipe.countDocuments({ ...keyword });

    // Fetch all recipes from the database
    const recipes = await Recipe.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("user", "id email fullName");

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes of the week available." });
    }

    // Respond with the list of recipes
    res.status(200).json({
      recipes,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    // If an unexpected error occurs, respond with a 500 Internal Server Error status and an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Get logged in user recipes
// @route POST /api/orders/myrecipes
// @access Private
const getMyRecipes = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;

      const recipes = await Recipe.find({
        user: req.query.id,
      })
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate("user", "id email fullName");

      const count = await Recipe.countDocuments({
        user: req.query.id,
      });

      if (recipes) {
        res.status(200).json({
          recipes,
          page,
          pages: Math.ceil(count / pageSize),
          count,
        });
      } else {
        res.status(404).json({ message: "Recipes not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// @desc Fetch recipes by cuisine
// @route GET /api/recipes/tag/:tag
// @access Public
const getRecipesByTag = asyncHandler(async (req: Request, res: Response) => {
  try {
    const recipePerPage = 20;
    let page = 1;

    if (req.query.pageNumber) {
      page = Number(req.query.pageNumber);
    }

    const tag = req.params.tag;

    const totalRecipes = await Recipe.countDocuments({
      tags: tag,
      ...buildFilterQuery(req.query),
    });

    const sortOptions = {
      Newest: { createdAt: -1 },
      "Most-Reviewed": { numReviews: -1 },
      "Highest-Rated": { rating: -1 },
    } as const;

    const sortOption = (req.query.sort as keyof typeof sortOptions) || "Newest"; // Use keyof to ensure that sortOption is one of the keys in sortOptions

    const recipes = await Recipe.find({
      tags: tag,
      ...buildFilterQuery(req.query),
    })
      .sort({
        ...sortOptions[sortOption],
      })
      .limit(recipePerPage)
      .skip(recipePerPage * (page - 1))
      .populate("user", "id email fullName");

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found." });
    }

    res.status(200).json({
      recipes,
      page,
      pages: Math.ceil(totalRecipes / recipePerPage),
      totalRecipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Fetch all  cuisines
// @route GET /api/recipes/cuisines
// @access Public
const getCuisines = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Fetch all cuisines from the database
    const cuisines = await Cuisines.find({});

    // Respond with the list of cuisines
    res.status(200).json(cuisines);
  } catch (error) {
    // If an unexpected error occurs, respond with a 500 Internal Server Error status and an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Fetch a recipe by ID
// @route GET /api/recipes/:id
// @access Public
const getRecipeById = asyncHandler(async (req: Request, res: Response) => {
  // Extracting the 'id' parameter from the request
  const { id } = req.params;

  try {
    // Check if the 'id' is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Respond with a 400 Bad Request status and an error message
      return res.status(400).json({ error: "Invalid id" });
    }

    // Attempt to find the recipe by its ID
    const recipe = await Recipe.findById(id).populate(
      "user",
      "id email fullName"
    );

    res.status(200).json(recipe);
  } catch (error) {
    // If an unexpected error occurs, respond with a 500 Internal Server Error status and an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Create a recipe
// @route POST /api/recipes
// @access Private/Admin
const createRecipe = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  try {
    const {
      recipeTitle,
      description,
      videoLink,
      servings,
      preparationTime,
      cookTime,
      totalTime,
      ingredients,
      instructions,
      cookTips,
      cuisineType,
      mealType,
      dietPreference,
      mainImage,
      tags,
    } = req.body;

    const validateInput = (field: any, errorMessage: string) => {
      if (!field) {
        res
          .status(400) // Changed status code to 400 for client error
          .json({ message: `Recipe Creation Failed. ${errorMessage}` });
        return false;
      }
      return true;
    };

    if (
      !validateInput(recipeTitle, "Please provide a recipe name.") ||
      !validateInput(description, "Please provide a recipe description.") ||
      !validateInput(videoLink, "Please provide a youtube video link.") ||
      !validateInput(servings, "Please provide how many servings.") ||
      !validateInput(ingredients, "Please provide the ingredients.") ||
      !validateInput(cuisineType, "Please provide the cuisine type.") ||
      !validateInput(mealType, "Please provide the meal type.") ||
      !validateInput(dietPreference, "Please provide the diet preference.")
    ) {
      return;
    }

    const ingredientsList = ingredients.map((ingredient: any) => ({
      quantity: ingredient.quantity,
      measurement: ingredient.measurement,
      item: ingredient.item,
    }));

    const instructionsList = instructions.map((instruction: any) => ({
      step: instruction.step,
      image: instruction.image,
    }));

    const recipe = new Recipe({
      recipeTitle,
      description,
      videoLink,
      servings,
      preparationTime: {
        hours: preparationTime.hours,
        minutes: preparationTime.minutes,
      },
      cookTime: {
        hours: cookTime.hours,
        minutes: cookTime.minutes,
      },
      totalTime: {
        hours: totalTime.hours,
        minutes: totalTime.minutes,
      },
      ingredients: ingredientsList,
      instructions: instructionsList,
      cookTips,
      cuisineType,
      mealType,
      dietPreference,
      mainImage,
      tags,
      user: req.userCredentials._id,
    });

    const message = "Recipe successfully created";
    const createdRecipe = await recipe.save();
    res.status(201).json({
      message,
      createdRecipe,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// @desc Update a recipe
// @route PUT /api/recipes/:id
// @access Private/Admin
const updateRecipe = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }

    const { recipeTitle, description, image } = req.body;

    recipe.recipeTitle = recipeTitle;

    const updatedRecipe = await recipe.save();
    res.status(200).json({
      message: "Recipe updated successfully",
      data: updatedRecipe,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Delete a recipe
// @route DELETE /api/recipes/:id
// @access Private/Admin
const deleteRecipe = asyncHandler(async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      await Recipe.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Recipe  deleted successfully" });
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Create a new review
// @route POST /api/recipes/:id/reviews
// @access Private
const createRecipeReview = asyncHandler<AuthenticatedRequest>(
  async (req, res) => {
    try {
      const { rating, comment } = req.body;

      // Check if rating and comment exist
      if (!rating || !comment) {
        return res
          .status(400)
          .json({ message: "Please submit both rating and comment." });
      }

      // Validate rating
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be a number between 1 and 5." });
      }

      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      const alreadyReviewed = recipe.reviews.find(
        (review) =>
          review.user.toString() === req.userCredentials._id.toString()
      );

      if (alreadyReviewed) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this recipe." });
      }

      const newReview = {
        user: req.userCredentials._id,
        fullName: req.userCredentials.fullName,
        image: req.userCredentials.image,
        recipeId: recipe._id,
        rating: Number(rating),
        comment,
      };

      recipe.reviews.push(newReview);

      // Update average rating
      recipe.numReviews = recipe.reviews.length;
      recipe.rating =
        recipe.reviews.reduce((total, review) => total + review.rating, 0) /
        recipe.numReviews;

      await recipe.save();

      res.status(201).json({ message: "Review submitted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// @desc Get all reviews for all recipes
// @route GET /api/recipes/reviews
// @access Private/Admin
const getAllRecipeReviews = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const pageSize = 9;
      const page = Number(req.query.pageNumber) || 1;

      const keyword = req.query.keyword
        ? {
            "reviews.firstName": {
              $regex: req.query.keyword,
              $options: "i",
            },
          }
        : {};

      const count = await Recipe.countDocuments({
        ...keyword,
        "reviews.0": { $exists: true },
      });

      // Fetch all recipes with reviews from the database
      const recipesWithReviews = await Recipe.find({
        ...keyword,
        "reviews.0": { $exists: true }, // Check if there is at least one review
      })
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      res.status(200).json({
        recipesWithReviews,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// @desc Delete a review by ID
// @route DELETE /api/recipes/reviews/:id
// @access Private/Admin
const deleteReviewById = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Find a recipe containing the review by its ID
    const recipe = await Recipe.findOne({
      "reviews._id": req.params.id, // Match review ID within the reviews array
    });

    if (recipe) {
      // Find the index of the review within the reviews array
      const index = recipe.reviews.findIndex(
        (review) => (review?._id ?? "").toString() === req.params.id
      );

      // Check if the review exists
      if (index !== -1) {
        // Remove the review at the found index
        recipe.reviews.splice(index, 1);

        // Decrease the number of reviews
        recipe.numReviews = recipe.reviews.length;

        // Recalculate the average rating
        if (recipe.reviews.length > 0) {
          const totalRating = recipe.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          recipe.rating = totalRating / recipe.reviews.length;
        } else {
          recipe.rating = 0; // No reviews, set rating to 0
        }

        await recipe.save();
        res.status(200).json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: error });
  }
});

// @desc Add a reply to a review
// @route POST /api/recipes/:recipeId/reviews/:reviewId/replies
// @access Private
const addReplyToReview = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { recipeId, reviewId } = req.params;
      const { comment, parentReplyId } = req.body;

      if (!comment) {
        return res.status(400).json({ message: "Comment is required." });
      }

      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      const review = recipe.reviews.id(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found." });
      }

      // Create a new reply object (no need to use `new Reply`)
      const newReply = {
        user: req.userCredentials._id,
        image: req.userCredentials.image,
        fullName: req.userCredentials.fullName,
        comment,
        parentReplyId: parentReplyId || null,
        likes: [],
        dislikes: [],
        replies: [],
        createdAt: new Date(),
      };

      // If parentReplyId is provided, find the parent reply and add this as a nested reply
      if (parentReplyId) {
        const parentReply = review.replies.id(parentReplyId);
        if (!parentReply) {
          return res.status(404).json({ message: "Parent reply not found." });
        }
        parentReply.replies.push(newReply); // Push the full reply object as it's embedded
      } else {
        // Add as a top-level reply
        review.replies.push(newReply); // Push the full reply object
      }

      await recipe.save(); // Save the recipe document after modifying the replies

      res.status(201).json({ message: "Reply added successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// @desc Like a review or reply
// @route POST /api/recipes/:recipeId/reviews/:reviewId/like
// @access Private
const likeReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { recipeId, reviewId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.userCredentials._id);

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404);
      throw new Error("Recipe not found");
    }

    const review = recipe.reviews.id(reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Check if user already liked the review
    const alreadyLiked = review.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the review
      review.likes = review.likes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    } else {
      // Like the review and remove any dislike if present
      review.likes.push(userId);
      review.dislikes = review.dislikes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    }

    await recipe.save();
    res.json({ success: true, likes: review.likes, dislikes: review.dislikes });
  }
);

// @desc Dislike a review or reply
// @route POST /api/recipes/:recipeId/reviews/:reviewId/dislike
// @access Private
const dislikeReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { recipeId, reviewId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.userCredentials._id);

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404);
      throw new Error("Recipe not found");
    }

    const review = recipe.reviews.id(reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Check if user already disliked the review
    const alreadyDisliked = review.dislikes.some(
      (id: mongoose.Types.ObjectId) => id.equals(userId)
    );

    if (alreadyDisliked) {
      // Remove dislike
      review.dislikes = review.dislikes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    } else {
      // Dislike the review and remove any like if present
      review.dislikes.push(userId);
      review.likes = review.likes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    }

    await recipe.save();
    res.json({ success: true, likes: review.likes, dislikes: review.dislikes });
  }
);

// @desc Like a reply
// @route POST /api/recipes/:recipeId/reviews/:reviewId/replies/:replyId/like
const likeReply = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { recipeId, reviewId, replyId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.userCredentials._id);

    console.log(req.params);

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });

    const review = recipe.reviews.id(reviewId) as Review | null;
    if (!review) return res.status(404).json({ message: "Review not found." });

    const reply: Reply | null = findReply(review.replies, replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found." });

    console.log(reply);

    // Check if user already liked the review
    const alreadyLiked = reply.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the reply
      reply.likes = reply.likes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    } else {
      // Like the review and remove any dislike if present
      reply.likes.push(userId);
      reply.dislikes = reply.dislikes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    }

    await recipe.save();
    res.json({ likes: reply.likes, dislikes: reply.dislikes });
  }
);

// @desc Dislike a reply
// @route POST /api/recipes/:recipeId/reviews/:reviewId/replies/:replyId/dislike
const dislikeReply = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { recipeId, reviewId, replyId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.userCredentials._id); // Change to ObjectId

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });

    const review = recipe.reviews.id(reviewId) as Review | null;
    if (!review) return res.status(404).json({ message: "Review not found." });

    const reply: Reply | null = findReply(review.replies, replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found." });

    // Toggle the dislike status
    if (reply.dislikes.includes(userId)) {
      reply.dislikes = reply.dislikes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      ); // Remove dislike
    } else {
      reply.dislikes.push(userId); // Add dislike
      // Remove like if it's already liked
      reply.likes = reply.likes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    }

    await recipe.save();
    res.json({ likes: reply.likes, dislikes: reply.dislikes });
  }
);

export {
  getRecipeById,
  getRecipes,
  getMyRecipes,
  getRecipesByTag,
  getCuisines,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  createRecipeReview,
  getAllRecipeReviews,
  deleteReviewById,
  addReplyToReview,
  likeReview,
  dislikeReview,
  likeReply,
  dislikeReply,
};
