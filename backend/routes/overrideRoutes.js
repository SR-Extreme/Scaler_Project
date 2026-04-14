import express from "express";
import {createOverrideController,getOverrideController} from "../controllers/overrideController.js";

const router = express.Router();

// Create override
router.post("/", createOverrideController);

// Get override by date
router.get("/:date", getOverrideController);

export default router;