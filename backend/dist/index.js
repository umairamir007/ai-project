"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const elevenRoutes_1 = __importDefault(require("./routes/elevenRoutes"));
const storage_1 = __importDefault(require("./routes/storage"));
const admin_1 = __importDefault(require("./routes/admin"));
const fishRoutes_1 = __importDefault(require("./routes/fishRoutes"));
const minimax_1 = __importDefault(require("./routes/minimax"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
const corsOptions = {
    origin: [constants_1.FRONTEND_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
}));
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/v1/elevenlabs", elevenRoutes_1.default);
app.use("/api/v1/storage", storage_1.default);
app.use("/api/v1/admin", admin_1.default);
app.use("/api/v1/fish", fishRoutes_1.default);
app.use("/api/v1/minimax", minimax_1.default);
// Global Error Handler
app.use(errorHandler_1.default);
// Health check
app.get("/", (_, res) => res.send("Backend is running fine."));
const port = constants_1.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
exports.default = app;
