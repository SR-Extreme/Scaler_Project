import express from "express";
import {
  createOverrideController,
  getOverrideController,
  deleteOverrideController,
} from "../controllers/overrideController.js";

const router = express.Router();

// Create override
router.post("/", createOverrideController);

// Get override by date
router.get("/:date", getOverrideController);

// Delete override by date
router.delete("/:date", deleteOverrideController);

export default router;