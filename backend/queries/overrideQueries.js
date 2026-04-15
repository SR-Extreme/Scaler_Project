import pool from "../config/postgres.js";

// Create Override
export const createOverride = async (data) => {
  const { user_id, override_date, is_available, start_time, end_time } = data;

  const result = await pool.query(
    `INSERT INTO date_overrides
     (user_id, override_date, is_available, start_time, end_time)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, override_date, is_available, start_time, end_time]
  );

  return result.rows[0];
};

// Get Override by Date
export const getOverrideByDate = async (user_id, date) => {
  const result = await pool.query(
    `SELECT * FROM date_overrides
     WHERE user_id = $1 AND override_date = $2`,
    [user_id, date]
  );

  return result.rows[0];
};

// Delete Override by Date
export const deleteOverrideByDate = async (user_id, date) => {
  const result = await pool.query(
    `DELETE FROM date_overrides
     WHERE user_id = $1 AND override_date = $2
     RETURNING *`,
    [user_id, date]
  );

  return result.rows[0];
};