// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

// Rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/api/auth', authRoutes);

// Error handler (dummy for now)
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

export default app;
