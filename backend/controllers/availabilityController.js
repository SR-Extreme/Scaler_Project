import {createSchedule,addAvailabilitySlot,getAvailabilityBySchedule,getSchedulesByUser} from "../queries/availabilityQueries.js";

// Create Schedule
export const createScheduleController = async (req, res) => {
  try {
    const { name } = req.body;

    const schedule = await createSchedule(1, name || "Default Schedule");

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (err) {
    console.error("Create Schedule Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Add Availability Slot
export const addAvailabilitySlotController = async (req, res) => {
  try {
    const { schedule_id, day_of_week, start_time, end_time, timezone } =
      req.body;

    if (
      schedule_id === undefined ||
      day_of_week === undefined ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        success: false,
        error: "Required fields: schedule_id, day_of_week, start_time, end_time",
      });
    }

    const slot = await addAvailabilitySlot({
      schedule_id,
      day_of_week,
      start_time,
      end_time,
      timezone: timezone || "UTC",
    });

    return res.status(201).json({
      success: true,
      message: "Availability slot added",
      data: slot,
    });
  } catch (err) {
    console.error("Add Slot Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get All Schedules (for user)
export const getSchedulesController = async (req, res) => {
  try {
    const schedules = await getSchedulesByUser(1);

    return res.json({
      success: true,
      data: schedules,
    });
  } catch (err) {
    console.error("Get Schedules Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get Availability by Schedule
export const getAvailabilityController = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    const slots = await getAvailabilityBySchedule(schedule_id);

    return res.json({
      success: true,
      data: slots,
    });
  } catch (err) {
    console.error("Get Availability Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};