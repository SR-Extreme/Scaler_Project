import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { getEventById, getSchedules, updateEvent } from "../services/api.js";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    buffer_time: "0",
    slug: "",
    schedule_id: "",
  });

  const sanitizeSlug = (value) => {
    const lastPart = value.trim().split("/").filter(Boolean).pop() || "";
    return lastPart
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const [schRes, eventRes] = await Promise.all([
          getSchedules(),
          getEventById(id),
        ]);

        if (!isActive) return;

        if (schRes.data.success) setSchedules(schRes.data.data);

        const event = eventRes.data.data;
        setForm({
          title: event?.title || "",
          description: event?.description || "",
          duration: event?.duration ?? "",
          buffer_time: event?.buffer_time ?? 0,
          slug: event?.slug || "",
          schedule_id: event?.schedule_id ?? "",
        });
        setError("");
      } catch (err) {
        console.error(err);
        if (!isActive) return;
        setError(err.response?.data?.error || "Unable to load event");
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "slug" ? sanitizeSlug(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateEvent(id, {
        ...form,
        duration: Number(form.duration),
        buffer_time: Number(form.buffer_time || 0),
      });
      if (res.data.success) {
        alert("Event updated successfully");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating event");
    }
  };

  return (
    <AppShell
      title="Edit event type"
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
      {loading ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
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
                  Buffer time (minutes)
                </label>
                <input
                  type="number"
                  name="buffer_time"
                  placeholder="0"
                  value={form.buffer_time}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  min={0}
                />
                <p className="text-xs text-neutral-500">
                  Adds a gap after each meeting before the next slot.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                Public link will be{" "}
                <span className="font-medium">
                  /book/{form.slug || "your-slug"}
                </span>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
              >
                Save changes
              </button>
            </div>
          </div>

          <aside className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-sm font-semibold text-neutral-900">Live preview</div>
            <div className="mt-2 text-xs text-neutral-500">
              Review how this event card appears before saving.
            </div>

            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {form.title || "Untitled event"}
                  </div>
                  <div className="mt-1 text-xs text-neutral-600">
                    {form.description || "No description"}
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-700">
                  {form.duration || "0"}m
                </span>
              </div>
              <div className="mt-3 text-xs text-neutral-600">
                URL: <span className="font-medium">/book/{form.slug || "your-slug"}</span>
              </div>
            </div>
          </aside>
        </form>
      )}
    </AppShell>
  );
};

export default EditEvent;

