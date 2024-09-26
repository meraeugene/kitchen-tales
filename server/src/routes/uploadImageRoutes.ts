import multer from "multer";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { s3Uploadv3Image } from "../services/s3Service";
// import { s3Uploadv3Images } from "../services/s3Service";

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5242880 }, // 5 MB in bytes
});

router.post(
  "/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { key, status } = await s3Uploadv3Image(
        req.file as Express.Multer.File
      );
      const image = `${process.env.AWS_URL}/${key}`;

      const message = "Image uploaded successfully.";

      return res.status(200).json({ status, image, message });
    } catch (error) {
      console.log(error);
    }
  }
);

// router.post(
//   "/images",
//   upload.array("images"),
//   async (req: Request, res: Response) => {
//     try {
//       await s3Uploadv3Images(req.files as Express.Multer.File[]);
//       return res.json({ status: "success" });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// Multer rrror handler middleware
router.use(
  (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message:
            "File size limit exceeded. Please upload files up to 5MB in size.",
        });
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          message: "Invalid file format. Please upload only image files.",
        });
      }
    }
    next(error);
  }
);

export default router;
