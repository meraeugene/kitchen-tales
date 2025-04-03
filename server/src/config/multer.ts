import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "uploads", // Change this folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  }),
});

const upload = multer({ storage });

export default upload;
