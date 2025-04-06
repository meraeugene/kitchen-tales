import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import generateJWTToken from "../utils/generateJWTToken";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { sendResetPasswordEmail } from "../services/resetPasswordEmail";
import PasswordReset from "../models/passwordResetModel";
import { verifyResetToken } from "../utils/verifyPasswordResetToken";
import { Types } from "mongoose";
import Recipe from "../models/recipeModel";
import { sendResetEmail } from "../services/resetEmail";
import EmailReset from "../models/resetEmailModel";

interface AuthenticatedRequest extends Request {
  userCredentials: {
    id: string;
    user: string;
    _id: string;
    isAdmin: boolean;
    fullName: string;
    email: string;
    image: string;
    aboutMe: string;
    address: string;
    socials: {
      fbLink: string;
      igLink: string;
      twitterLink: string;
      linkedinLink: string;
    };
  };
}

// @desc Register a user
// @route POST /api/users/auth/register
// @access Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Destructure user input from the request body
    let { fullName, email, password } = req.body;

    // Trim whitespace from input fields
    if (email && password) {
      email = email.trim();
      password = password.trim();
    }

    // Check for empty input fields
    if (fullName === "" || email === "" || password === "") {
      res.status(400).json({ message: "Input fields are empty" });
      return;
    }

    // Validate full name format (only alphabets allowed)
    const fullNameRegex = /^[a-zA-Z\s]+$/;
    if (!fullNameRegex.test(fullName)) {
      res.status(400).json({
        message:
          "Invalid full name format. Only alphabets and spaces are allowed.",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Please enter a valid email address.",
      });
      return;
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 6 characters with one special character, one digit, and one capital letter.",
      });

      return;
    }

    // Check if user with the given email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({
        message: "Registration failed. Please use a different email address.",
      });
      return;
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance and Save the new user to the database
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      isAdmin: false,
      remindStatus: false,
    });

    // Respond with success and additional data
    return res.status(201).json({
      success: true,
      redirectTo: "/auth/login",
      message: "Your account has been created successfully.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
    });
  }
});

// @desc Login user
// @route POST /api/users/auth/login
// @access Public
const loginUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check for empty input fields
      if (email === "" || password === "") {
        res.status(400).json({ message: "Input fields are empty" });
        return;
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          message: "Please enter a valid email address.",
        });
        return;
      }

      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        const { _id, isAdmin } = user;

        generateJWTToken(res, _id);

        res.status(200).json({
          status: "SUCCESS",
          data: { isAdmin, _id },
          message: "Login Successfully",
          redirectTo: "/",
        });
      } else {
        res.status(400).json({
          message:
            "The account name or password that you have entered is incorrect.",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Internal Server Error",
      });
    }
  }
);

// @desc Validate user token
// @route PUT /api/users/validate-token
// @access Private
const validateToken = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.userCredentials._id);

    if (user) {
      const { _id, isAdmin, image } = user;
      res.status(200).json({ _id, isAdmin });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  }
);

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // use this if same site ang backend and client host
    res.clearCookie("jwt");

    //  use this if different site ang backend and client host
    // res.clearCookie("jwt", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development", // secure: true in production
    //   sameSite: "none", // Ensure cookies can be shared between different domains
    // });

    // Respond with a 200 OK status and a success message
    res.status(200).json({ message: "Log out successfully", redirectTo: "/" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch user profile based on the authenticated user's ID
      const user = await User.findById(req.userCredentials._id);

      // Check if the user exists
      if (user) {
        // Destructure user properties for a cleaner response
        const {
          _id,
          fullName,
          email,
          isAdmin,
          remindStatus,
          image,
          aboutMe,
          socials,
          address,
          bookmarks,
        } = user;

        // Respond with a 200 OK status and the user profile details
        res.status(200).json({
          _id,
          fullName,
          email,
          isAdmin,
          remindStatus,
          image,
          aboutMe,
          address,
          socials: {
            fbLink: socials.fbLink,
            igLink: socials.igLink,
            twitterLink: socials.twitterLink,
            linkedinLink: socials.linkedinLink,
          },
          bookmarks,
        });
      } else {
        // Respond with a 404 Not Found status
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error) {
      // Respond with a 500 Internal Server Error status
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        fullName,
        image,
        aboutMe,
        address,
        fbLink,
        igLink,
        twitterLink,
        linkedinLink,
      } = req.body;

      // Retrieve the user based on the ID from the request credentials
      const user = await User.findById(req.userCredentials._id);

      //Check if the user exists
      if (!user) {
        res.status(404).json({
          message: "User not found.",
        });
      }

      if (user) {
        user.image = image || user.image;
        user.fullName = fullName || user.fullName;
        user.address = address || user.address;
        user.aboutMe = aboutMe || user.aboutMe;
        user.socials.fbLink = fbLink || user.socials.fbLink;
        user.socials.twitterLink = twitterLink || user.socials.twitterLink;
        user.socials.igLink = igLink || user.socials.igLink;
        user.socials.linkedinLink = linkedinLink || user.socials.linkedinLink;

        // Save the updated user information
        const updatedUser = await user.save();

        // Respond with the updated user details
        res.status(200).json({
          status: "SUCCESS",
          data: {
            fullName: updatedUser.fullName,
            image: updatedUser.image,
            aboutMe: updatedUser.aboutMe,
            address: updatedUser.address,
            socials: {
              fbLink: updatedUser.socials.fbLink,
              igLink: updatedUser.socials.igLink,
              twitterLink: updatedUser.socials.twitterLink,
              linkedinLink: updatedUser.socials.linkedinLink,
            },
          },
          message: "Profile Updated Succesfully.",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  }
);

// @desc Send  password reset link
// @route POST /api/users/sendPasswordResetLink
// @access Private
const sendPasswordResetLinkToEmail = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const response = await sendResetPasswordEmail({
        _id: req.userCredentials._id,
        email: req.userCredentials.email,
      });
      res.status(200).json({
        status: "SUCCESS",
        message: response.message,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

// @desc Update user password
// @route PUT /api/users/resetPassword
// @access Private
const resetPassword = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { newPassword, token } = req.body;
    const { email } = req.userCredentials;

    // Verify the reset token
    const isTokenValid = await verifyResetToken(email, token);

    if (isTokenValid.isValid) {
      return res.status(400).json({
        message: isTokenValid.message,
      });
    }

    try {
      if (newPassword === "") {
        res.status(404).json({
          message: "Password Reset Failed. Fill in the required fields.",
        });

        return;
      }

      const user = await User.findById(req.userCredentials._id);

      if (user) {
        // Check if the reset token has already been used
        const existingToken = await PasswordReset.findOne({
          email: user.email,
        });

        if (!existingToken) {
          return res.status(400).json({
            message:
              "Reset password link is already used. If you need to reset your password, please request a new reset link.",
          });
        }

        const isPasswordMatch = await user.matchPassword(newPassword);

        if (isPasswordMatch) {
          res.status(400).json({
            message:
              "The password you provided is still the same. Please choose a different password.",
          });

          return;
        }

        // Validate password
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!passwordRegex.test(newPassword)) {
          res.status(400).json({
            message:
              "Password must be at least 6 characters with one special character, one digit, and one capital letter.",
          });

          return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;

        await user.save();

        // Invalidate the reset token after using it
        await PasswordReset.deleteOne({ email: user.email });

        res.status(200).json({
          status: "SUCCESS",
          message: "Password Reset Succesfully",
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
);

// @desc Send email reset link
// @route POST /api/users/sendEmailResetLink
// @access Private
const sendEmailResetLink = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const response = await sendResetEmail({
        _id: req.userCredentials._id,
        email: req.userCredentials.email,
      });
      res.status(200).json({
        status: "SUCCESS",
        message: response.message,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

// @desc Update user email
// @route PUT /api/users/resetEmail
// @access Private
const resetEmail = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { newEmail, token } = req.body;
    const { email } = req.userCredentials;

    // Verify the reset token
    const isTokenValid = await verifyResetToken(email, token);

    if (isTokenValid.isValid) {
      return res.status(400).json({
        message: isTokenValid.message,
      });
    }

    try {
      if (newEmail === "") {
        res.status(404).json({
          message: "Email Reset Failed. Fill in the required fields.",
        });

        return;
      }

      // Check if the new email is the same as the current email
      if (newEmail === email) {
        return res.status(400).json({
          message:
            "The email you provided is still the same. Please choose a different email.",
        });
      }

      // Check if the new email is already in use
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({
          message:
            "The email you provided is already in use. Please choose a different email.",
        });
      }

      const user = await User.findById(req.userCredentials._id);

      if (user) {
        // Check if the reset token has already been used
        const existingToken = await EmailReset.findOne({
          email: user.email,
        });

        if (!existingToken) {
          return res.status(400).json({
            message:
              "Reset email link is already used. If you need to reset your email, please request a new reset link.",
          });
        }

        // Update the email address
        user.email = newEmail;
        await user.save();

        // Invalidate the reset token after using it
        await EmailReset.deleteOne({ email: user.email });

        res.status(200).json({
          status: "SUCCESS",
          message: "Email Reset Succesfully",
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
);

// @desc Get  users
// @route PUT /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          firstName: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await User.countDocuments({ ...keyword });

    const users = await User.find({ ...keyword })
      .select("-password") // This excludes the 'password' field from the result
      .sort({ isAdmin: -1, createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Get  user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    // Check if the user exists
    if (user) {
      // Destructure user properties for a cleaner response
      const {
        _id,
        fullName,
        email,
        isAdmin,
        remindStatus,
        image,
        aboutMe,
        socials,
        address,
      } = user;

      // Respond with a 200 OK status and the user profile details
      res.status(200).json({
        _id,
        fullName,
        email,
        isAdmin,
        remindStatus,
        image,
        aboutMe,
        address,
        socials: {
          fbLink: socials.fbLink,
          igLink: socials.igLink,
          twitterLink: socials.twitterLink,
          linkedinLink: socials.linkedinLink,
        },
      });
    } else {
      // Respond with a 404 Not Found status
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Delete users
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(404).json({
          message: "Cannot delete admin user",
        });
      } else {
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: "User deleted successfully" });
      }
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Update users
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.fullName = req.body.fullname || user.fullName;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();

      res.status(200).json({
        status: "SUCCESS",
        data: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
        message: "User updated successfully",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Remind user for event
// @route PUT /api/users/remind
// @access Private
const remindUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Check if the user exists
    if (!user) {
      res.status(404).json({
        message: "Email not found.",
      });
      return; // Return early to avoid proceeding with null 'user'
    }

    if (user.remindStatus) {
      res.status(404).json({
        message:
          "You have already requested a reminder. You can only be reminded once.",
      });
      return;
    }

    // Update user information based on the request body
    user.remindStatus = true;

    // Save the updated user information
    const updatedUser = await user.save();

    // Respond with the updated user details
    res.status(200).json({
      status: "SUCCESS",
      data: updatedUser,
      message: `You'll receive a reminder 7 days before special occasions at ${req.body.email}. Privacy guaranteed, no spam or sharing.`,
    });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message, // Include more details about the error
    });
  }
});

// @desc Add bookmark
// @route POST /api/users/:id/bookmarks/add
// @access Private
const addRecipeToBookmarks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = new Types.ObjectId(req.userCredentials._id);

    try {
      const user = await User.findById(userId);
      const recipeId = req.params.recipeId;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the recipe is already bookmarked
      if (user.bookmarks.includes(recipeId)) {
        return res.status(400).json({ message: "Recipe already bookmarked" });
      }

      // Add the recipe ID to user's bookmarks
      user.bookmarks.push(recipeId);
      await user.save();

      res.status(200).json({ message: "Added to bookmarks" });
    } catch (error) {
      console.error("Error adding bookmark:", error);
      res.status(500).json({ message: "Error adding bookmark" });
    }
  }
);

// @desc Remove bookmark
// @route DELETE /api/users/:id/bookmarks/remove
// @access Private
const removeRecipeFromBookmarks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userCredentials._id;

    try {
      const user = await User.findById(userId);
      const recipeId = req.params.recipeId;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the recipe is bookmarked
      if (!user.bookmarks.includes(recipeId)) {
        return res.status(400).json({ message: "Recipe not bookmarked" });
      }

      // Remove the recipe ID from user's bookmarks
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== recipeId
      );
      await user.save();

      res.status(200).json({ message: "Recipe remove from bookmarks" });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      res.status(500).json({ message: "Error removing bookmark" });
    }
  }
);

// @desc Get all bookmarked recipes
// @route GET /api/users/:id/bookmarks
// @access Private
const getAllBookmarkedRecipes = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userCredentials._id;

    try {
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;

      const count = await Recipe.countDocuments();

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch details of all bookmarked recipes
      const bookmarkedRecipes = await Recipe.find({
        _id: { $in: user.bookmarks },
      })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate("user", "id email fullName");

      res.status(200).json({
        bookmarkedRecipes,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      });
    } catch (error) {
      console.error("Error getting bookmarked recipes:", error);
      res.status(500).json({ message: "Error getting bookmarked recipes" });
    }
  }
);

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  sendPasswordResetLinkToEmail,
  resetPassword,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  remindUser,
  validateToken,
  addRecipeToBookmarks,
  removeRecipeFromBookmarks,
  getAllBookmarkedRecipes,
  sendEmailResetLink,
  resetEmail,
};
