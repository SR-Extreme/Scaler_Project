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

  const result = await pool.query(
    `INSERT INTO availability_slots 
     (schedule_id, day_of_week, start_time, end_time, timezone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [schedule_id, day_of_week, start_time, end_time, timezone]
  );

  return result.rows[0];
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