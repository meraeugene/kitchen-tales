import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  resetPassword,
  remindUser,
  validateToken,
  sendPasswordResetLinkToEmail,
  addRecipeToBookmarks,
  removeRecipeFromBookmarks,
  getAllBookmarkedRecipes,
  sendEmailResetLink,
  resetEmail,
} from "../controllers/userController";
import { protect, admin } from "../middlewares/authMiddleware";
import checkObjectId from "../middlewares/checkObjectId";

const router = express.Router();

// AUTHENTICATION ROUTES
// Signup
router.post("/auth/register", registerUser);
// Login
router.post("/auth/login", loginUser);
// Logout
router.post("/auth/logout", logoutUser);
// Validate User Token
router.get("/validate-token", protect, validateToken);

// PASSWORD & EMAIL RESET ROUTES
// Send Reset Password Link
router.post("/sendPasswordResetLink", protect, sendPasswordResetLinkToEmail);
// Send Reset Email Link
router.post("/sendEmailResetLink", protect, sendEmailResetLink);
// Reset Password
router.put("/resetPassword", protect, resetPassword);
// Reset Email
router.put("/resetEmail", protect, resetEmail);

// USER PROFILE ROUTES
// Get or Update User Profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Remind User
router.put("/remind", protect, remindUser);

// BOOKMARK ROUTES
// Get all bookmarked recipes for a user
router.route("/:id/bookmarks").get(protect, getAllBookmarkedRecipes);
// Add a recipe to bookmarks
router.route("/:recipeId/bookmarks/add").post(protect, addRecipeToBookmarks);
// Remove a recipe from bookmarks
router
  .route("/:recipeId/bookmarks/remove")
  .delete(protect, removeRecipeFromBookmarks);

// ADMIN ROUTES
// Get all users (admin only)
router.get("/", protect, admin, getUsers);

// User-specific admin operations
router
  .route("/:id")
  .delete(protect, admin, checkObjectId, deleteUser)
  .get(checkObjectId, getUserById) // Public: user profile view
  .put(protect, admin, checkObjectId, updateUser);

export default router;
