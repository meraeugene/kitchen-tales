import { AUTH_URL, USERS_URL } from "../contants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    loginSocialsAuth: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/socials`,
        method: "POST",
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/auth/logout`,
        method: "POST",
      }),
    }),
    sendPasswordResetLinkToEmail: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/sendPasswordResetLink`,
        method: "POST",
      }),
    }),
    sendEmailResetLink: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/sendEmailResetLink`,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resetPassword`,
        method: "PUT",
        body: data,
      }),
    }),
    resetEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resetEmail`,
        method: "PUT",
        body: data,
      }),
    }),
    remindUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/remind`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: USERS_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    validateToken: builder.query({
      query: () => ({
        url: `${USERS_URL}/validate-token`,
      }),
      keepUnusedDataFor: 5,
    }),
    getBookmarkedRecipes: builder.query({
      query: ({ pageNumber, userId }) => ({
        url: `${USERS_URL}/${userId}/bookmarks`,
        params: {
          pageNumber,
        },
      }),
      providesTags: ["Bookmarks"],
      keepUnusedDataFor: 5,
    }),
    addToBookmark: builder.mutation({
      query: (recipeId) => ({
        url: `${USERS_URL}/${recipeId}/bookmarks/add`,
        method: "POST",
        body: recipeId,
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    removeFromBookmark: builder.mutation({
      query: (recipeId) => ({
        url: `${USERS_URL}/${recipeId}/bookmarks/remove`,
        method: "DELETE",
        body: recipeId,
      }),
      invalidatesTags: ["Bookmarks"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUpdateProfileMutation,
  useGetUserProfileQuery,
  useResetPasswordMutation,
  useSendPasswordResetLinkToEmailMutation,
  useRemindUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useLoginSocialsAuthMutation,
  useValidateTokenQuery,
  useAddToBookmarkMutation,
  useRemoveFromBookmarkMutation,
  useGetBookmarkedRecipesQuery,
  useSendEmailResetLinkMutation,
  useResetEmailMutation,
} = usersApiSlice;
