import { useState, useEffect } from "react";
import { createEvent, getSchedules } from "../services/api.js";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    slug: "",
    schedule_id: "",
  });

  const [schedules, setSchedules] = useState([]);

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await getSchedules();
      if (res.data.success) {
        setSchedules(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createEvent({
        ...form,
        duration: Number(form.duration),
      });

      if (res.data.success) {
        alert("Event created successfully");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error creating event");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* Description */}
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          {/* Duration */}
          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* Slug */}
          <input
            type="text"
            name="slug"
            placeholder="Slug (unique URL)"
            value={form.slug}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* Schedule Dropdown */}
          <select
            name="schedule_id"
            value={form.schedule_id}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          >
            <option value="">Select Schedule</option>
            {schedules.map((sch) => (
              <option key={sch.id} value={sch.id}>
                {sch.name}
              </option>
            ))}
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Create Event
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateEvent;