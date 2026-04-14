import {createOverride,getOverrideByDate} from "../queries/overrideQueries.js";

// Create Override
export const createOverrideController = async (req, res) => {
  try {
    const { override_date, is_available, start_time, end_time } = req.body;

    if (!override_date) {
      return res.status(400).json({
        success: false,
        error: "override_date is required",
      });
    }

    const override = await createOverride({
      user_id: 1,
      override_date,
      is_available: is_available ?? false,
      start_time,
      end_time,
    });

    return res.status(201).json({
      success: true,
      message: "Override created",
      data: override,
    });
  } catch (err) {
    console.error("Override Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get Override
export const getOverrideController = async (req, res) => {
  try {
    const { date } = req.params;

    const override = await getOverrideByDate(1, date);

    return res.json({
      success: true,
      data: override || null,
    });
  } catch (err) {
    console.error("Get Override Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};