import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../contants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders(headers) {
    return headers;
  },
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Recipes",
    "Bookmarks",
    "RecipesByTag",
    "Users",
    "Reviews",
    "Contact",
    "Articles",
    "ArticlesByTitle",
  ],
  endpoints: () => ({}),
});
