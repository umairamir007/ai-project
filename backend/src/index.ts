import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import { PORT } from "./constants";
import userRoutes from "./routes/User/userRoutes";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/Authentication/authRoutes";

//TODO:add frontedn url live
export const frontend_url = "https://stable-pal.vercel.app";
export const local_url = "http://localhost:3000";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: [
    frontend_url, // Latest URL for frontend
    local_url, // URL for local env
  ],
  // credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Disable caching globally
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Adjust Helmet settings
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin resources
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

app.get("/", (_, res) => {
  res.status(200);
  console.log("🚀 ~ app.get ~ Backend is running fine here:");
  res.send("Backend is running fine here ............");
});

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
export default app;
