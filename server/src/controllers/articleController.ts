import asyncHandler from "../middlewares/asyncHandler";
import Article from "../models/articleModel";
import { Request, Response } from "express";

// @desc Fetch all articles
// @route GET /api/articles
// @access Public
const getArticles = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Article.countDocuments({ ...keyword });

    // Fetch all recipes from the database
    const articles = await Article.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles available." });
    }

    // Respond with the list of recipes
    res.status(200).json({
      articles,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    // If an unexpected error occurs, respond with a 500 Internal Server Error status and an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Fetch articles by title
// @route GET /api/articles/title/:title
// @access Public
const getArticlesByTitle = asyncHandler(async (req: Request, res: Response) => {
  try {
    const title = req.params.title;

    // Fetch articles from the database based on the specified title
    const articles = await Article.find({ title });

    // Check if there are no articles with the specified tag
    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: "No articles found with the specified title" });
    }

    res.status(200).json(articles);
  } catch (error) {
    // If an unexpected error occurs, respond with a 500 Internal Server Error status and an error message
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { getArticles, getArticlesByTitle };
