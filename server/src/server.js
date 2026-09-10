import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import controllerRoutes from "./routes/controllerRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Game Controller Shop API is running");
});

app.use("/api/controllers", controllerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});