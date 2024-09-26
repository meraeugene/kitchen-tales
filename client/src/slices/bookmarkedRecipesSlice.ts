import { createSlice } from "@reduxjs/toolkit";
import { Recipe } from "../types";

const storedBookmarkedRecipesID = localStorage.getItem("bookmarkedRecipesID");
const storedBookmarkedRecipesData = localStorage.getItem(
  "bookmarkedRecipesData",
);

const initialState = {
  bookmarkedRecipesID: storedBookmarkedRecipesID
    ? JSON.parse(storedBookmarkedRecipesID)
    : [],
  bookmarkedRecipesData: storedBookmarkedRecipesData
    ? JSON.parse(storedBookmarkedRecipesData)
    : [],
};

const bookmarkedRecipesSlice = createSlice({
  name: "bookmarkedRecipes",
  initialState,
  reducers: {
    addToBookmark(state, action) {
      const { recipeId } = action.payload;
      if (!state.bookmarkedRecipesID.includes(recipeId)) {
        state.bookmarkedRecipesID.push(recipeId);
        localStorage.setItem(
          "bookmarkedRecipesID",
          JSON.stringify(state.bookmarkedRecipesID),
        );
      }
    },
    removeFromBookmark(state, action) {
      const { recipeId } = action.payload;
      const index = state.bookmarkedRecipesID.indexOf(recipeId);
      if (index !== -1) {
        state.bookmarkedRecipesID.splice(index, 1);
        localStorage.setItem(
          "bookmarkedRecipesID",
          JSON.stringify(state.bookmarkedRecipesID),
        );
      }
    },
    clearBookmarks(state) {
      state.bookmarkedRecipesID = [];
      localStorage.removeItem("bookmarkedRecipesID");
    },
    setRecipeBookmarksID(state, action) {
      const bookmarksID = action.payload;
      state.bookmarkedRecipesID = bookmarksID;
    },
    setBookmarkedRecipesData(state, action) {
      state.bookmarkedRecipesData = action.payload;
    },
    removeFromBookmarkData(state, action) {
      const { recipeId } = action.payload;
      state.bookmarkedRecipesData = state.bookmarkedRecipesData.filter(
        (recipe: Recipe) => recipe._id !== recipeId,
      );
      state.bookmarkedRecipesID = state.bookmarkedRecipesID.filter(
        (id: string) => id !== recipeId,
      );
    },
  },
});

export const {
  addToBookmark,
  removeFromBookmark,
  clearBookmarks,
  setRecipeBookmarksID,
  setBookmarkedRecipesData,
  removeFromBookmarkData,
} = bookmarkedRecipesSlice.actions;

export default bookmarkedRecipesSlice.reducer;
