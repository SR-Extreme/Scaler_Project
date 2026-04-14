import express from "express";
import {createEventController,getAllEventsController,getEventBySlugController,deleteEventController} from "../controllers/eventController.js";

const router = express.Router();

// Create Event
router.post("/", createEventController);

// Get All Events
router.get("/", getAllEventsController);

// Get Event by Slug
router.get("/:slug", getEventBySlugController);

// Delete Event
router.delete("/:id", deleteEventController);

export default router;