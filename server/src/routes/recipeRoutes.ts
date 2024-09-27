import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  createRecipeReview,
  getAllRecipeReviews,
  deleteReviewById,
  getCuisines,
  getRecipesByTag,
  getMyRecipes,
  addReplyToReview,
  likeReview,
  dislikeReview,
  dislikeReply,
  likeReply,
} from "../controllers/recipeController";
import { protect, admin } from "../middlewares/authMiddleware";
import checkObjectId from "../middlewares/checkObjectId";

const router = express.Router();

// ===================
// Recipe Routes
// ===================

// Get all recipes and create a new recipe
router.route("/").get(getRecipes).post(protect, createRecipe);

// Get my recipes
router.route("/myrecipes").get(getMyRecipes);

// Get all cuisines
router.route("/cuisines").get(getCuisines);

// Get recipes by tag
router.route("/tag/:tag").get(getRecipesByTag);

// ===================
// Recipe Reviews Routes
// ===================

// Get all reviews (Admin only)
router.route("/reviews").get(protect, admin, getAllRecipeReviews);

// Delete a review by Admin
router
  .route("/reviews/:id")
  .delete(protect, admin, checkObjectId, deleteReviewById);

// Create a review for a specific recipe
router.route("/:id/reviews").post(protect, checkObjectId, createRecipeReview);

// Add a reply to a review
router
  .route("/:recipeId/reviews/:reviewId/replies")
  .post(protect, addReplyToReview);

// Like a review
router.route("/:recipeId/reviews/:reviewId/like").post(protect, likeReview);

// Dislike a review
router
  .route("/:recipeId/reviews/:reviewId/dislike")
  .post(protect, dislikeReview);

// Like a reply within a review
router
  .route("/:recipeId/reviews/:reviewId/replies/:replyId/like")
  .post(protect, likeReply);

// Dislike a reply within a review
router
  .route("/:recipeId/reviews/:reviewId/replies/:replyId/dislike")
  .post(protect, dislikeReply);

// ===================
// Individual Recipe Routes
// ===================

// Manage recipe by ID (get, update, delete)
router
  .route("/:id")
  .get(checkObjectId, getRecipeById)
  .put(protect, admin, checkObjectId, updateRecipe)
  .delete(protect, admin, checkObjectId, deleteRecipe);

export default router;
