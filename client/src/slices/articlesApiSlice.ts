import { ARTICLES_URL } from "../contants";
import { apiSlice } from "./apiSlice";

export const articlesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: ARTICLES_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Articles"],
      keepUnusedDataFor: 5,
    }),
    getArticlesByTitle: builder.query({
      query: ({ title }) => ({
        url: `${ARTICLES_URL}/title/${title}`,
      }),
      providesTags: ["ArticlesByTitle"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticlesByTitleQuery } =
  articlesApiSlice;
