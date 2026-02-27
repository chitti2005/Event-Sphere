import { Event } from "../models/Event.js";
import { Registration } from "../models/Registration.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// backend/src/controllers/event.controller.js
export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await Registration.create({
      eventId: id,
      name,
      email,
    });

    res.json({ message: "Registration successful" });
  } catch (err) {
    // 🔑 Duplicate registration
    if (err.code === 11000) {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({
      eventId: req.params.id,
    });
    res.json(regs);
  } catch {
    res.status(500).json({ message: "Failed to load registrations" });
  }
};

export const healthCheck = (req, res) => {
  res.json({ status: "ok" });
};