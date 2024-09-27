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

// USER ROUTES
// Signup
router.post("/auth/register", registerUser);
// Login
router.post("/auth/login", loginUser);
//  Validate User Token
router.get("/validate-token", protect, validateToken);
//  Get user profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
//  Logout
router.post("/auth/logout", logoutUser);
// Send Reset Password Link
router.post("/sendPasswordResetLink", protect, sendPasswordResetLinkToEmail);
// Send Reset Email Link
router.post("/sendEmailResetLink", protect, sendEmailResetLink);
// Reset Password
router.put("/resetPassword", protect, resetPassword);
// Reset Email
router.put("/resetEmail", protect, resetEmail);
// Remind User
router.put("/remind", protect, remindUser);

// ADMIN ROUTES
//  Get all users
router.get("/", protect, admin, getUsers);
// Delete , Get user by id, update user info
router
  .route("/:id")
  .delete(protect, admin, checkObjectId, deleteUser)
  .get(checkObjectId, getUserById)
  .put(protect, admin, checkObjectId, updateUser);

// Get all bookmarked recipes
router.route("/:id/bookmarks").get(protect, getAllBookmarkedRecipes);
// Add recipe to bookmark
router.route("/:recipeId/bookmarks/add").post(protect, addRecipeToBookmarks);
// Remove recipe from bookmark
router
  .route("/:recipeId/bookmarks/remove")
  .delete(protect, removeRecipeFromBookmarks);

export default router;
