import pool from "../config/postgres.js";

// Helper: convert time string → minutes
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Helper: minutes → time string
const minutesToTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

// 🔥 MAIN FUNCTION
export const generateAvailableSlots = async (slug, date) => {
  // 1. Get event type
  const eventRes = await pool.query(
    `SELECT * FROM event_types WHERE slug = $1`,
    [slug]
  );

  const event = eventRes.rows[0];
  if (!event) throw new Error("Event not found");

  const { id: eventTypeId, duration, buffer_time, schedule_id } = event;

  // 2. Get day of week (0–6)
  const dayOfWeek = new Date(date).getDay();

  // 3. Get availability for that day
  const availRes = await pool.query(
    `SELECT * FROM availability_slots
     WHERE schedule_id = $1 AND day_of_week = $2`,
    [schedule_id, dayOfWeek]
  );

  const availability = availRes.rows;

  if (availability.length === 0) return [];

  // 4. Get already booked slots
  const bookingRes = await pool.query(
    `SELECT start_time FROM bookings
     WHERE event_type_id = $1 AND booking_date = $2 AND status = 'BOOKED'`,
    [eventTypeId, date]
  );

  const bookedSlots = bookingRes.rows.map((b) =>
    b.start_time.toString().slice(0, 5)
  );

  let allSlots = [];

  // 5. Generate slots
  for (const slot of availability) {
    let start = timeToMinutes(slot.start_time.toString().slice(0, 5));
    let end = timeToMinutes(slot.end_time.toString().slice(0, 5));

    while (start + duration <= end) {
      allSlots.push(minutesToTime(start));
      start += duration + buffer_time;
    }
  }

  // 6. Remove booked slots
  const availableSlots = allSlots.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return availableSlots;
};