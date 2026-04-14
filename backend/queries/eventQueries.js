import pool from "../../config/postgres.js";

// Create Event
export const createEvent = async (data) => {
  const { title, description, duration, slug, schedule_id } = data;

  const query = `
    INSERT INTO event_types (user_id, title, description, duration, slug, schedule_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [1, title, description, duration, slug, schedule_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get All Events
export const getAllEvents = async () => {
  const result = await pool.query(`SELECT * FROM event_types ORDER BY created_at DESC`);
  return result.rows;
};

// Get Event by Slug
export const getEventBySlug = async (slug) => {
  const result = await pool.query(
    `SELECT * FROM event_types WHERE slug = $1`,
    [slug]
  );

  return result.rows[0];
};

// Delete Event
export const deleteEvent = async (id) => {
  await pool.query(`DELETE FROM event_types WHERE id = $1`, [id]);
};