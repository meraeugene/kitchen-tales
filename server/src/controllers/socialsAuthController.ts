import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/userModel";
import generateJWTToken from "../utils/generateJWTToken";
import { Request, Response } from "express";

// @desc Post data from Google or Facebook authentication
// @route POST /api/auth/socials
// @access Public
const createSocialAuth = asyncHandler(async (req: Request, res: Response) => {
  const { email, fullName, image } = req.body;

  if (!email || !fullName || !image) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fullName,
        email,
        image,
        isAdmin: false,
        remindStatus: false,
      });
      await user.save();
    }

    generateJWTToken(res, user._id);

    const { _id, isAdmin } = user;

    res.status(200).json({
      status: "SUCCESS",
      data: {
        _id,
        isAdmin,
      },
      redirectTo: "/",
      message: "Login Successfully.",
    });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(400).json({
      message: "An error occurred while processing the request.",
    });
  }
});

export { createSocialAuth };
