import pool from "../config/postgres.js";
import { generateAvailableSlots } from "../services/slotService.js";

// GET AVAILABLE SLOTS
export const getAvailableSlotsController = async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: "Date is required",
      });
    }

    const slots = await generateAvailableSlots(slug, date);

    return res.json({
      success: true,
      data: slots,
    });
  } catch (err) {
    console.error("Slot Error:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// CREATE BOOKING
export const createBookingController = async (req, res) => {
  try {
    const { event_type_id, name, email, date, start_time, end_time } =
      req.body;

    if (!event_type_id || !name || !email || !date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // 🔒 Check if slot already booked
    const existing = await pool.query(
      `SELECT * FROM bookings
       WHERE event_type_id = $1
       AND booking_date = $2
       AND start_time = $3`,
      [event_type_id, date, start_time]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Slot already booked",
      });
    }

    // ✅ Insert booking
    const result = await pool.query(
      `INSERT INTO bookings 
       (event_type_id, name, email, booking_date, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [event_type_id, name, email, date, start_time, end_time]
    );

    return res.status(201).json({
      success: true,
      message: "Booking successful",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Booking Error:", err.message);

    // Handle DB unique constraint
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        error: "Slot already booked",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// GET ALL BOOKINGS
export const getBookingsController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings ORDER BY booking_date, start_time`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Get Bookings Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// CANCEL BOOKING
export const cancelBookingController = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE bookings SET status = 'CANCELLED' WHERE id = $1`,
      [id]
    );

    return res.json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (err) {
    console.error("Cancel Booking Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};