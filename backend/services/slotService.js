import pool from "../config/postgres.js";
import { getOverrideByDate } from "../queries/overrideQueries.js";

// Helper: convert time string → minutes
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Helper: stable day-of-week for YYYY-MM-DD (0-6, Sun-Sat)
const getUtcDayOfWeek = (dateStr) => {
  // Avoid local timezone shifting the day for "YYYY-MM-DD" inputs
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d.getUTCDay();
};

// Helper: minutes → time string
const minutesToTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const isFutureSlot = (date, time) => {
  const slotDateTime = new Date(`${date}T${time}:00`);
  return !Number.isNaN(slotDateTime.getTime()) && slotDateTime > new Date();
};

// MAIN FUNCTION
export const generateAvailableSlots = async (slug, date) => {
  // 1. Get event type
  const eventRes = await pool.query(
    `SELECT * FROM event_types WHERE LOWER(slug) = LOWER($1)`,
    [slug]
  );

  const event = eventRes.rows[0];
  if (!event) throw new Error("Event not found");

  const { id: eventTypeId, duration, buffer_time, schedule_id } = event;
  const durationMinutes = Number(duration);
  const bufferMinutes = Number(buffer_time || 0);

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Error("Invalid event duration");
  }

  // 2. Get day of week (0–6)
  const dayOfWeek = getUtcDayOfWeek(date);

  // 3. Get availability for that day
  const availRes = await pool.query(
    `SELECT * FROM availability_slots
     WHERE schedule_id = $1 AND day_of_week = $2`,
    [schedule_id, dayOfWeek]
  );

  let availability = availRes.rows;

  //  4. APPLY DATE OVERRIDE HERE
  const override = await getOverrideByDate(1, date);

  if (override) {
    //  Block entire day
    if (!override.is_available) {
      return [];
    }

    // Override time range
    if (override.start_time && override.end_time) {
      availability = [
        {
          start_time: override.start_time,
          end_time: override.end_time,
        },
      ];
    }
  }

  // If no availability → no slots
  if (!availability || availability.length === 0) return [];

  // 5. Get already booked slots
  const bookingRes = await pool.query(
    `SELECT start_time FROM bookings
     WHERE event_type_id = $1 
     AND booking_date = $2 
     AND status = 'BOOKED'`,
    [eventTypeId, date]
  );

  const bookedSlots = bookingRes.rows.map((b) =>
    String(b.start_time).slice(0, 5)
  );

  let allSlots = [];

  // 6. Generate slots
  for (const slot of availability) {
    let start = timeToMinutes(slot.start_time.toString().slice(0, 5));
    let end = timeToMinutes(slot.end_time.toString().slice(0, 5));

    while (start + durationMinutes <= end) {
      allSlots.push(minutesToTime(start));
      start += durationMinutes + bufferMinutes;
    }
  }

  // 7. Remove booked slots
  const availableSlots = allSlots.filter(
    (slot) => !bookedSlots.includes(slot) && isFutureSlot(date, slot)
  );

  return availableSlots;
};