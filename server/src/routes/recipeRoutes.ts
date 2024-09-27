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

// Manage recipe (create, get)
router.route("/").get(getRecipes).post(protect, createRecipe);
// Get individual recipes
router.route("/myrecipes").get(getMyRecipes);
// Get all cuisines
router.route("/cuisines").get(getCuisines);
// Sort and get  recipes  by tag
router.route("/tag/:tag").get(getRecipesByTag);
router.route("/reviews").get(protect, admin, getAllRecipeReviews);
// Delete a review by Admin
router
  .route("/reviews/:id")
  .delete(protect, admin, checkObjectId, deleteReviewById);
// Create a review by everyone
router.route("/:id/reviews").post(protect, checkObjectId, createRecipeReview);
// Add reply to a review
router
  .route("/:recipeId/reviews/:reviewId/replies")
  .post(protect, addReplyToReview);
// Like a review
router.route("/:recipeId/reviews/:reviewId/like").post(protect, likeReview);
//  Dislike  a review
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
// Manage  recipe  by Id (get, update,delete)
router
  .route("/:id")
  .get(checkObjectId, getRecipeById)
  .put(protect, admin, checkObjectId, updateRecipe)
  .delete(protect, admin, checkObjectId, deleteRecipe);

export default router;
