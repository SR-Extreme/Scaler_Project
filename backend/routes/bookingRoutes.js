import express from "express";
import {
  getAvailableSlotsController,
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  cancelBookingController,
} from "../controllers/bookingController.js";

const router = express.Router();

// Get available slots
router.get("/slots/:slug", getAvailableSlotsController);

// Create booking
router.post("/", createBookingController);

// Get all bookings
router.get("/", getBookingsController);

// Get booking by id (confirmation deep link)
router.get("/:id", getBookingByIdController);

// Cancel booking
router.delete("/:id", cancelBookingController);

export default router;