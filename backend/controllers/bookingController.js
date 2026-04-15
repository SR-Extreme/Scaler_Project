import pool from "../config/postgres.js";
import { generateAvailableSlots } from "../services/slotService.js";
import { sendMailerConfirm, sendMailerCancel } from "../utils/sendMailer.js";

const sendEmailSafely = (emailPromise, label) => {
  Promise.resolve(emailPromise).catch((error) => {
    console.error(`${label} Email Error:`, error.message);
  });
};

const isFutureDateTime = (date, time) => {
  const dateTime = new Date(`${date}T${time}:00`);
  return !Number.isNaN(dateTime.getTime()) && dateTime > new Date();
};

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

    if (!isFutureDateTime(date, start_time)) {
      return res.status(400).json({
        success: false,
        error: "Cannot book past date/time slots",
      });
    }

    // Insert booking (DB constraint also prevents double-booking)
    const result = await pool.query(
      `INSERT INTO bookings 
       (event_type_id, name, email, booking_date, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'BOOKED')
       RETURNING *`,
      [event_type_id, name, email, date, start_time, end_time]
    );

    // Booking success should not depend on mail server availability.
    sendEmailSafely(
      sendMailerConfirm(name, email, date, start_time, end_time),
      "Booking Confirmation"
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
      // Some environments may have a non-partial unique constraint on (event_type_id, booking_date, start_time).
      // If the conflicting row is CANCELLED, reuse it (mark it BOOKED again) so the slot becomes re-bookable.
      try {
        const { event_type_id, name, email, date, start_time, end_time } =
          req.body;

        const existing = await pool.query(
          `SELECT id, status FROM bookings
           WHERE event_type_id = $1
             AND booking_date = $2
             AND start_time = $3
           ORDER BY id DESC
           LIMIT 1`,
          [event_type_id, date, start_time]
        );

        const row = existing.rows[0];
        if (row && row.status !== "BOOKED") {
          const revived = await pool.query(
            `UPDATE bookings
             SET name = $1,
                 email = $2,
                 end_time = $3,
                 status = 'BOOKED'
             WHERE id = $4
             RETURNING *`,
            [name, email, end_time, row.id]
          );

          return res.status(201).json({
            success: true,
            message: "Booking successful",
            data: revived.rows[0],
          });
        }
      } catch (e) {
        console.error("Recover Booking Error:", e.message);
      }

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

// GET BOOKING BY ID (for confirmation deep link)
export const getBookingByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
         b.*,
         e.title AS event_title,
         e.slug AS event_slug,
         e.duration AS event_duration
       FROM bookings b
       JOIN event_types e ON e.id = b.event_type_id
       WHERE b.id = $1`,
      [id]
    );

    const booking = result.rows[0];
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    console.error("Get Booking By ID Error:", err.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// CANCEL BOOKING
export const cancelBookingController = async (req, res) => {
  try {
    const { id } = req.params;

    // Only cancel active bookings; returning row helps confirm DB state
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'CANCELLED'
       WHERE id = $1 AND status = 'BOOKED'
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found or already cancelled",
      });
    }

    const cancelledBooking = result.rows[0];
    const { name, email, booking_date, start_time, end_time } = cancelledBooking;

    // Cancellation should complete even if email fails.
    sendEmailSafely(
      sendMailerCancel(name, email, booking_date, start_time, end_time),
      "Booking Cancellation"
    );

    return res.json({
      success: true,
      message: "Booking cancelled",
      data: cancelledBooking,
    });
  } catch (err) {
    console.error("Cancel Booking Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};