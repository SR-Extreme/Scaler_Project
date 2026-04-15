import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api",
  withCredentials: false, // no auth required
});

// EVENT APIs

// Get all events
export const getEvents = async () => {
  return API.get("/events");
};

// Get event by slug
export const getEventBySlug = async (slug) => {
  return API.get(`/events/${encodeURIComponent(slug)}`);
};

// Create event
export const createEvent = async (data) => {
  return API.post("/events", data);
};

// Delete event
export const deleteEvent = async (id) => {
  return API.delete(`/events/${id}`);
};

// Get event by id (for editing)
export const getEventById = async (id) => {
  return API.get(`/events/id/${id}`);
};

// Update event
export const updateEvent = async (id, data) => {
  return API.put(`/events/${id}`, data);
};

// AVAILABILITY APIs

// Create schedule
export const createSchedule = async (data) => {
  return API.post("/availability/schedule", data);
};

// Add availability slot
export const addSlot = async (data) => {
  return API.post("/availability/slot", data);
};

// Delete availability slot
export const deleteSlot = async (slot_id) => {
  return API.delete(`/availability/slot/${slot_id}`);
};

// Get all schedules
export const getSchedules = async () => {
  return API.get("/availability/schedules");
};

// Get slots for a schedule
export const getAvailabilitySlots = async (schedule_id) => {
  return API.get(`/availability/slots/${schedule_id}`);
};

// BOOKING APIs

// Get available slots for event
export const getAvailableSlots = async (slug, date) => {
  return API.get(`/bookings/slots/${slug}?date=${date}`);
};

// Create booking
export const createBooking = async (data) => {
  return API.post("/bookings", data);
};

// Get all bookings
export const getBookings = async () => {
  return API.get("/bookings");
};

// Cancel booking
export const cancelBooking = async (id) => {
  return API.delete(`/bookings/${id}`);
};

// Get booking by id (for confirmation deep link)
export const getBooking = async (id) => {
  return API.get(`/bookings/${id}`);
};

// RESCHEDULE API

export const rescheduleBooking = async (data) => {
  return API.post("/reschedule", data);
};

// DATE OVERRIDES API

// Create override
export const createOverride = async (data) => {
  return API.post("/overrides", data);
};

// Get override by date
export const getOverride = async (date) => {
  return API.get(`/overrides/${date}`);
};

// Cancel override by date
export const cancelOverride = async (date) => {
  return API.delete(`/overrides/${date}`);
};

export default API;