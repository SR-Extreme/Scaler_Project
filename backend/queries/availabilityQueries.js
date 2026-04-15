import pool from "../config/postgres.js";

// Create Schedule
export const createSchedule = async (user_id, name) => {
  const result = await pool.query(
    `INSERT INTO availability_schedules (user_id, name)
     VALUES ($1, $2)
     RETURNING *`,
    [user_id, name]
  );

  return result.rows[0];
};

// Add Availability Slot
export const addAvailabilitySlot = async (data) => {
  const { schedule_id, day_of_week, start_time, end_time, timezone } = data;

  const overlapResult = await pool.query(
    `SELECT id FROM availability_slots
     WHERE schedule_id = $1
       AND day_of_week = $2
       AND $3::time < end_time
       AND $4::time > start_time
     LIMIT 1`,
    [schedule_id, day_of_week, start_time, end_time]
  );

  if (overlapResult.rowCount > 0) {
    const error = new Error("Slot overlaps with an existing slot");
    error.code = "SLOT_OVERLAP";
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO availability_slots 
     (schedule_id, day_of_week, start_time, end_time, timezone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [schedule_id, day_of_week, start_time, end_time, timezone]
  );

  return result.rows[0];
};

// Delete availability slot
export const deleteAvailabilitySlot = async (slot_id) => {
  const result = await pool.query(
    `DELETE FROM availability_slots
     WHERE id = $1
     RETURNING *`,
    [slot_id]
  );

  return result.rows[0] || null;
};

// Get Slots by Schedule
export const getAvailabilityBySchedule = async (schedule_id) => {
  const result = await pool.query(
    `SELECT * FROM availability_slots 
     WHERE schedule_id = $1
     ORDER BY day_of_week, start_time`,
    [schedule_id]
  );

  return result.rows;
};

// Get Schedule by User
export const getSchedulesByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM availability_schedules WHERE user_id = $1`,
    [user_id]
  );

  return result.rows;
};