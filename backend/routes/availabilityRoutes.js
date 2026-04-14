import express from "express";
import {createScheduleController,addAvailabilitySlotController,getSchedulesController,getAvailabilityController} from "../controllers/availabilityController.js";

const router = express.Router();

// Create Schedule
router.post("/schedule", createScheduleController);

// Add Availability Slot
router.post("/slot", addAvailabilitySlotController);

// Get All Schedules
router.get("/schedules", getSchedulesController);

// Get Availability Slots by Schedule
router.get("/slots/:schedule_id", getAvailabilityController);

export default router;