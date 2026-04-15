import pool from "../config/postgres.js";

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

// Get Event by ID
export const getEventById = async (id) => {
  const result = await pool.query(`SELECT * FROM event_types WHERE id = $1`, [
    id,
  ]);
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
    `SELECT * FROM event_types WHERE LOWER(slug) = LOWER($1)`,
    [slug]
  );

  return result.rows[0];
};

// Update Event
export const updateEvent = async (id, data) => {
  const { title, description, duration, slug, schedule_id } = data;

  const result = await pool.query(
    `UPDATE event_types
     SET title = $1,
         description = $2,
         duration = $3,
         slug = $4,
         schedule_id = $5
     WHERE id = $6
     RETURNING *`,
    [title, description || null, duration, slug, schedule_id, id]
  );

  return result.rows[0];
};

// Delete Event
export const deleteEvent = async (id) => {
  await pool.query(`DELETE FROM event_types WHERE id = $1`, [id]);
};