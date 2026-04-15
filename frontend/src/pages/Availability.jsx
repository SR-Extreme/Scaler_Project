import { useState, useEffect } from "react";
import {
  createSchedule,
  addSlot,
  getSchedules,
  getAvailabilitySlots,
} from "../services/api.js";

const Availability = () => {
  const [scheduleName, setScheduleName] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const [slots, setSlots] = useState([]);

  const [slotForm, setSlotForm] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
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
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <h1 className="text-2xl font-semibold mb-6">
        Availability
      </h1>

      {/* Create Schedule */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Create Schedule</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Schedule Name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />

          <button
            onClick={handleCreateSchedule}
            className="bg-black text-white px-4 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>

      {/* Select Schedule */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Select Schedule</h2>

        <select
          className="border p-2 rounded-lg w-full"
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Choose Schedule</option>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Slot */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Add Slot</h2>

        <div className="grid grid-cols-3 gap-3">
          
          <select
            onChange={(e) =>
              setSlotForm({ ...slotForm, day_of_week: e.target.value })
            }
            className="border p-2 rounded-lg"
          >
            <option value="">Day</option>
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </select>

          <input
            type="time"
            onChange={(e) =>
              setSlotForm({ ...slotForm, start_time: e.target.value })
            }
            className="border p-2 rounded-lg"
          />

          <input
            type="time"
            onChange={(e) =>
              setSlotForm({ ...slotForm, end_time: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleAddSlot}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
        >
          Add Slot
        </button>
      </div>

      {/* Slots List */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Slots</h2>

        {slots.length === 0 ? (
          <p>No slots</p>
        ) : (
          slots.map((s) => (
            <div
              key={s.id}
              className="border p-2 rounded mb-2 flex justify-between"
            >
              <span>
                Day {s.day_of_week} | {s.start_time} - {s.end_time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Availability;