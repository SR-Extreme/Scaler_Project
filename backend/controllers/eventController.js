import {
  createEvent,
  getAllEvents,
  getEventBySlug,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../queries/eventQueries.js";

// Create Event
export const createEventController = async (req, res) => {
  try {
    const { title, description, duration, slug, schedule_id, buffer_time } = req.body;

    if (!title || !duration || !slug || !schedule_id) {
      return res.status(400).json({
        success: false,
        error: "Required fields: title, duration, slug, schedule_id",
      });
    }

    const event = await createEvent({
      title,
      description,
      duration,
      slug,
      schedule_id,
      buffer_time: Number.isFinite(Number(buffer_time)) ? Number(buffer_time) : 0,
    });

    res.status(201).json({ success: true, message: "Event created successfully", data: event });
  } catch (err) {
    console.error("Create Event Error:", err.message);

    // Handle duplicate slug
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Slug must be unique",
      });
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get All Events
export const getAllEventsController = async (req, res) => {
  try {
    const events = await getAllEvents();

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Get Events Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get Event by Slug
export const getEventBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await getEventBySlug(slug);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Get Event Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get Event by ID
export const getEventByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Get Event By ID Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update Event
export const updateEventController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, slug, schedule_id, buffer_time } = req.body;

    if (!title || !duration || !slug || !schedule_id) {
      return res.status(400).json({
        success: false,
        error: "Required fields: title, duration, slug, schedule_id",
      });
    }

    const updated = await updateEvent(id, {
      title,
      description,
      duration,
      slug,
      schedule_id,
      buffer_time: Number.isFinite(Number(buffer_time)) ? Number(buffer_time) : 0,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update Event Error:", err.message);

    // Handle duplicate slug
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        error: "Slug must be unique",
      });
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Delete Event
export const deleteEventController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteEvent(id);

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete Event Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};