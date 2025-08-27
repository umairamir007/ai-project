import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import { FRONTEND_URL, PORT } from "./constants";
import errorHandler from "./middlewares/errorHandler";
import elevenRoutes from "./routes/ElevenLabs/elevenRoutes";
import adminImport from "./routes/admin";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

const corsOptions: cors.CorsOptions = {
  origin: [FRONTEND_URL, "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/v1/elevenlabs", elevenRoutes);
app.use("/api/v1/admin", adminImport);

// Global Error Handler
app.use(errorHandler);

// Health check
app.get("/", (_, res) => res.send("Backend is running fine."));

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
