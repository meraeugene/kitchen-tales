import express, { Request, Response } from "express";
import upload from "../config/multer";

const router = express.Router();

router.post("/image", upload.single("image"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ imageUrl: (req.file as Express.Multer.File).path });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
