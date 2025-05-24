import { RECIPES_URL, CATEGORIES_URL } from "../contants";
import { apiSlice } from "./apiSlice";

// Utility function to clean up undefined query params
const cleanParams = (params: { [key: string]: any }) => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null),
  );
};

export const recipesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: RECIPES_URL,
        params: cleanParams({ keyword, pageNumber }),
      }),
      providesTags: ["Recipes"],
      keepUnusedDataFor: 5,
    }),
    getMyRecipes: builder.query({
      query: ({ keyword, pageNumber, id }) => ({
        url: `${RECIPES_URL}/myrecipes`,
        params: {
          keyword,
          pageNumber,
          id,
        },
      }),
      providesTags: ["Recipes"],
      keepUnusedDataFor: 5,
    }),
    getRecipesByTag: builder.query({
      query: ({
        tag,
        pageNumber,
        sort,
        cuisineType,
        dietPreference,
        mealType,
        cookTime,
      }) => {
        return {
          url: `${RECIPES_URL}/tag/${tag}`,
          params: {
            pageNumber,
            sort,
            cuisineType,
            dietPreference,
            mealType,
            cookTime,
          },
        };
      },
      providesTags: ["RecipesByTag"],
      keepUnusedDataFor: 5,
    }),
    getCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getRecipeDetails: builder.query({
      query: (recipeId) => ({
        url: `${RECIPES_URL}/${recipeId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createRecipe: builder.mutation({
      query: (data) => ({
        url: RECIPES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Recipes"],
    }),
    updateRecipe: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${RECIPES_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Recipes"],
    }),
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `${RECIPES_URL}/${recipeId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${RECIPES_URL}/${data.recipeId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Recipes"],
    }),
    getReviews: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: `${RECIPES_URL}/reviews`,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Reviews"],
      keepUnusedDataFor: 5,
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${RECIPES_URL}/reviews/${reviewId}`,
        method: "DELETE",
      }),
    }),
    addReplyToReview: builder.mutation({
      query: ({ recipeId, reviewId, reply }) => ({
        url: `${RECIPES_URL}/${recipeId}/reviews/${reviewId}/replies`,
        method: "POST",
        body: reply,
      }),
    }),
    likeReview: builder.mutation({
      query: ({ recipeId, reviewId, replyId }) => ({
        url: `${RECIPES_URL}/${recipeId}/reviews/${reviewId}/like`,
        method: "POST",
        body: { replyId },
      }),
    }),
    dislikeReview: builder.mutation({
      query: ({ recipeId, reviewId, replyId }) => ({
        url: `${RECIPES_URL}/${recipeId}/reviews/${reviewId}/dislike`,
        method: "POST",
        body: { replyId },
      }),
    }),
    likeReply: builder.mutation({
      query: ({ recipeId, reviewId, replyId }) => ({
        url: `${RECIPES_URL}/${recipeId}/reviews/${reviewId}/replies/${replyId}/like`,
        method: "POST",
      }),
    }),
    dislikeReply: builder.mutation({
      query: ({ recipeId, reviewId, replyId }) => ({
        url: `${RECIPES_URL}/${recipeId}/reviews/${reviewId}/replies/${replyId}/dislike`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipesByTagQuery,
  useGetCategoriesQuery,
  useGetRecipeDetailsQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useCreateReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useGetMyRecipesQuery,
  useAddReplyToReviewMutation,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useLikeReplyMutation,
  useDislikeReplyMutation,
} = recipesApiSlice;
