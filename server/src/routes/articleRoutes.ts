import express from "express";
import {
  getArticles,
  getArticlesByTitle,
} from "../controllers/articleController";

const router = express.Router();

// Get all carticles
router.route("/").get(getArticles);
//  Get articles by title
router.route("/title/:title").get(getArticlesByTitle);

export default router;
