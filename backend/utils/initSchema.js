import pool from "../config/postgres.js";

const initSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS availability_schedules (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id SERIAL PRIMARY KEY,
      schedule_id INTEGER NOT NULL REFERENCES availability_schedules(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      timezone VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_types (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      duration INTEGER NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      schedule_id INTEGER REFERENCES availability_schedules(id) ON DELETE SET NULL,
      buffer_time INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS date_overrides (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      override_date DATE NOT NULL,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      start_time TIME,
      end_time TIME,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, override_date)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      event_type_id INTEGER NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_active_slot
    ON bookings(event_type_id, booking_date, start_time)
    WHERE status = 'BOOKED';
  `);
};

export default initSchema;
