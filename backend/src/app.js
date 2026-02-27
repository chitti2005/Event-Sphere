// backend/src/app.js

import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", eventRoutes);

// Health / root route
app.get("/", (req, res) => {
  res.json({ message: "EventSphere API is running" });
});

export default app;