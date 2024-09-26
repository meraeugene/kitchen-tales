import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import asyncHandler from "./asyncHandler";

interface AuthenticatedRequest extends Request {
  userCredentials: {
    _id: string;
    isAdmin: boolean;
  };
}

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    // Read the JWT from the cookie
    token = req.cookies.jwt;

    if (token) {
      try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        if (!jwtSecretKey) {
          console.error(
            "JWT_SECRET_KEY is not defined in the environment variables."
          );
          res.status(500).send("Internal Server Error");
          return;
        }

        const decodedToken = jwt.verify(token, jwtSecretKey) as MyJwtPayload;

        // ETO LAMANG NG USER CREDENTIALS
        req.userCredentials = await User.findById(decodedToken.userId).select(
          "-password"
        );

        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

const admin = (req: any, res: Response, next: NextFunction) => {
  if (req.userCredentials && req.userCredentials.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};

export { protect, admin };
