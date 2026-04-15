import { useState, useEffect } from "react";
import {
  createSchedule,
  addSlot,
  getSchedules,
  getAvailabilitySlots,
} from "../services/api.js";
import AppShell from "../components/AppShell.jsx";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Availability = () => {
  const [scheduleName, setScheduleName] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const [slots, setSlots] = useState([]);

  const [slotForm, setSlotForm] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  });

  // Fetch schedules
  const fetchSchedules = async () => {
    const res = await getSchedules();
    if (res.data.success) {
      setSchedules(res.data.data);
    }
  };

  // Fetch slots
  const fetchSlots = async (id) => {
    const res = await getAvailabilitySlots(id);
    if (res.data.success) {
      setSlots(res.data.data);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Create schedule
  const handleCreateSchedule = async () => {
    if (!scheduleName) return alert("Enter schedule name");

    const res = await createSchedule({ name: scheduleName });

    if (res.data.success) {
      setScheduleName("");
      fetchSchedules();
    }
  };

  // Select schedule
  const handleSelect = async (id) => {
    setSelectedSchedule(id);
    fetchSlots(id);
  };

  // Add slot
  const handleAddSlot = async () => {
    if (!selectedSchedule) return alert("Select schedule first");

    const res = await addSlot({
      schedule_id: selectedSchedule,
      ...slotForm,
    });

    if (res.data.success) {
      fetchSlots(selectedSchedule);
    }
  };

  return (
    <AppShell title="Availability">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="text-sm font-semibold">Schedules</div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="New schedule name"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />

              <button
                onClick={handleCreateSchedule}
                className="shrink-0 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Create
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="text-xs font-medium text-neutral-600">
              Select schedule
            </div>
            <select
              value={selectedSchedule}
              className="mt-2 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              onChange={(e) => handleSelect(e.target.value)}
            >
              <option value="">Choose schedule</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-sm font-semibold">Working hours</div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <select
                value={slotForm.day_of_week}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, day_of_week: e.target.value })
                }
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              >
                <option value="">Day</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="0">Sunday</option>
              </select>

              <input
                type="time"
                value={slotForm.start_time}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, start_time: e.target.value })
                }
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />

              <input
                type="time"
                value={slotForm.end_time}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, end_time: e.target.value })
                }
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />

              <input
                type="text"
                value={slotForm.timezone}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, timezone: e.target.value })
                }
                placeholder="Timezone (e.g. Asia/Kolkata)"
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </div>

            <button
              onClick={handleAddSlot}
              className="mt-3 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Add time range
            </button>
          </div>

          <div className="rounded-lg border border-neutral-200">
            <div className="border-b border-neutral-200 p-4 text-sm font-semibold">
              Current slots
            </div>
            <div className="p-4">
              {slots.length === 0 ? (
                <div className="text-sm text-neutral-600">No slots yet.</div>
              ) : (
                <div className="space-y-2">
                  {slots.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
                    >
                      <span className="text-neutral-800">
                        {dayNames[Number(s.day_of_week)] || `Day ${s.day_of_week}`} •{" "}
                        {String(s.start_time).slice(0, 5)} - {String(s.end_time).slice(0, 5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default Availability;