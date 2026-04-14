import express from "express";
import {getAvailableSlotsController,createBookingController,getBookingsController,cancelBookingController} from "../controllers/bookingController.js";

const router = express.Router();

// Get available slots
router.get("/slots/:slug", getAvailableSlotsController);

// Create booking
router.post("/", createBookingController);

// Get all bookings
router.get("/", getBookingsController);

// Cancel booking
router.delete("/:id", cancelBookingController);

export default router;