import express from "express";
import { createSocialAuth } from "../controllers/socialsAuthController";

const router = express.Router();

router.route("/socials").post(createSocialAuth);

export default router;
