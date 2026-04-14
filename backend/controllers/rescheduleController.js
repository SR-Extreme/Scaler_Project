import pool from "../config/postgres.js";

// RESCHEDULE BOOKING
export const rescheduleBookingController = async (req, res) => {
  try {
    const { booking_id, new_date, new_start_time, new_end_time } = req.body;

    if (!booking_id || !new_date || !new_start_time || !new_end_time) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // 1. Get old booking
    const oldBookingRes = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [booking_id]
    );

    const oldBooking = oldBookingRes.rows[0];

    if (!oldBooking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // 2. Check new slot availability
    const conflict = await pool.query(
      `SELECT * FROM bookings
       WHERE event_type_id = $1
       AND booking_date = $2
       AND start_time = $3
       AND status = 'BOOKED'`,
      [oldBooking.event_type_id, new_date, new_start_time]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "New slot already booked",
      });
    }

    // 3. Cancel old booking
    await pool.query(
      `UPDATE bookings SET status = 'RESCHEDULED' WHERE id = $1`,
      [booking_id]
    );

    // 4. Create new booking
    const newBookingRes = await pool.query(
      `INSERT INTO bookings
       (event_type_id, name, email, booking_date, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        oldBooking.event_type_id,
        oldBooking.name,
        oldBooking.email,
        new_date,
        new_start_time,
        new_end_time,
      ]
    );

    // 5. Save reschedule record
    await pool.query(
      `INSERT INTO reschedules (old_booking_id, new_booking_id)
       VALUES ($1, $2)`,
      [booking_id, newBookingRes.rows[0].id]
    );

    return res.json({
      success: true,
      message: "Booking rescheduled successfully",
      data: newBookingRes.rows[0],
    });
  } catch (err) {
    console.error("Reschedule Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};