import express from "express";
import {
  createEventController,
  getAllEventsController,
  getEventBySlugController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "../controllers/eventController.js";

const router = express.Router();

// Create Event
router.post("/", createEventController);

// Get All Events
router.get("/", getAllEventsController);

// Get Event by ID (for editing)
router.get("/id/:id", getEventByIdController);

// Get Event by Slug
router.get("/:slug", getEventBySlugController);

// Update Event
router.put("/:id", updateEventController);

// Delete Event
router.delete("/:id", deleteEventController);

export default router;