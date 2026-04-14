import express from "express";
import { rescheduleBookingController } from "../controllers/rescheduleController.js";

const router = express.Router();

router.post("/", rescheduleBookingController);

export default router;