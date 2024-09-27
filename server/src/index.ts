import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import connectDb from "./config/db";
import recipeRoutes from "./routes/recipeRoutes";
import userRoutes from "./routes/userRoutes";
import contactRoutes from "./routes/contactRoutes";
import socialsAuthRoutes from "./routes/socialsAuthRoutes";
import uploadImageRoutes from "./routes/uploadImageRoutes";
import articleRoutes from "./routes/articleRoutes";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";

const port = process.env.PORT || 5000;

connectDb();

const app = express();

app.use(
  cors({
    origin: "https://kitchen-tales.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Cookie parser middleware
app.use(cookieParser());

console.log("Current directory:", __dirname);

app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", socialsAuthRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/upload", uploadImageRoutes);

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  // any route that is not an api will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port} `));
