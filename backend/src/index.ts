import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import { FRONTEND_URLS, PORT } from "./constants";
import errorHandler from "./middlewares/errorHandler";
import elevenRoutes from "./routes/elevenRoutes";
import storageRoutes from "./routes/storage";
import adminImport from "./routes/admin";
import fishRoutes from "./routes/fishRoutes";
import minimaxRoutes from "./routes/minimax";
import authRoutes from "./routes/user.routes"
import projectRoutes from "./routes/project.routes";
import connectDB from "./config/db";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

connectDB()

const corsOptions: cors.CorsOptions = {
  origin: [
    ...FRONTEND_URLS,
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/elevenlabs", elevenRoutes);
app.use("/api/v1/storage", storageRoutes);
app.use("/api/v1/admin", adminImport);
app.use("/api/v1/fish", fishRoutes);
app.use("/api/v1/minimax", minimaxRoutes);
app.use("/api/v1", projectRoutes);

// Global Error Handler
app.use(errorHandler);

// Health check
app.get("/", (_, res) => res.send("Backend is running fine."));

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
