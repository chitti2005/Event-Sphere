import express from "express";
import {
  getEvents,
  createEvent,
  registerForEvent,
  getRegistrations,
  healthCheck,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/health", healthCheck);

router.get("/events", getEvents);
router.post("/events", createEvent);
router.post("/events/:id/register", registerForEvent);
router.get("/events/:id/registrations", getRegistrations);

export default router;