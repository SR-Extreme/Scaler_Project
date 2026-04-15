import { useState, useEffect } from "react";
import { createEvent, getSchedules } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";

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

  const sanitizeSlug = (value) => {
    const lastPart = value.trim().split("/").filter(Boolean).pop() || "";
    return lastPart
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "slug" ? sanitizeSlug(value) : value,
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
    <AppShell
      title="Create event type"
      right={
        <button
          onClick={() => navigate("/")}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
          type="button"
        >
          Back
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">Title</label>
          <input
            type="text"
            name="title"
            placeholder="15 Minute Meeting"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Quick intro call"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-800">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              placeholder="15"
              value={form.duration}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              required
              min={5}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-800">
              Availability schedule
            </label>
            <select
              name="schedule_id"
              value={form.schedule_id}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              required
            >
              <option value="">Select schedule</option>
              {schedules.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            URL slug
          </label>
          <input
            type="text"
            name="slug"
            placeholder="15min"
            value={form.slug}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            required
          />
          <p className="text-xs text-neutral-500">
            Public link will be <span className="font-medium">/book/{form.slug || "your-slug"}</span>
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
          >
            Create event type
          </button>
        </div>
      </form>
    </AppShell>
  );
};

export default CreateEvent;