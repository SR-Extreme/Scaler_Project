import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAvailableSlots,
  createBooking,
  getEventBySlug,
} from "../services/api.js";
import { useNavigate } from "react-router-dom";

const getTodayLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isFutureDateTime = (date, time) => {
  const dateTime = new Date(`${date}T${time}:00`);
  return !Number.isNaN(dateTime.getTime()) && dateTime > new Date();
};

const BookingPage = () => {
  const params = useParams();
  const rawSlug = params.slug ?? params["*"] ?? "";
  const slug = rawSlug.split("/").filter(Boolean).pop().toLowerCase() || "";
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const today = getTodayLocalDateString();

  // Fetch event info
  useEffect(() => {
    if (!slug) return;
    let isActive = true;

    (async () => {
      try {
        const res = await getEventBySlug(slug);
        const found = res.data.data;
        if (!isActive) return;
        setEvent(found || null);
        setError(found ? "" : "Event not found");
      } catch (err) {
        console.error(err);
        if (!isActive) return;
        setEvent(null);
        setError("Unable to load event");
      }
    })();

    return () => {
      isActive = false;
    };
  }, [slug]);

  // Fetch slots
  useEffect(() => {
    if (!date || !slug) return;
    let isActive = true;

    (async () => {
      try {
        const res = await getAvailableSlots(slug, date);
        if (!isActive) return;
        if (res.data.success) setSlots(res.data.data);
      } catch (err) {
        console.error(err);
        if (!isActive) return;
        setSlots([]);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [date, slug]);

  // Booking
  const handleBooking = async () => {
    if (!selectedSlot) return alert("Select a slot");
    if (!event) return alert("Event not loaded");
    if (!isFutureDateTime(date, selectedSlot)) {
      return alert("Please select a future slot");
    }

    const endTime = addMinutes(selectedSlot, event.duration);

    try {
      const res = await createBooking({
        event_type_id: event.id,
        name: form.name,
        email: form.email,
        date,
        start_time: selectedSlot,
        end_time: endTime,
      });

      if (res.data.success) {
        const bookingId = res.data.data?.id;
        navigate(`/confirmation${bookingId ? `?bookingId=${bookingId}` : ""}`, {
          state: {
            name: form.name,
            date,
            time: selectedSlot,
          },
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  // Helper to calculate end time
  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + mins;

    const hh = String(Math.floor(total / 60)).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");

    return `${hh}:${mm}`;
  };

  return (
    <div className="min-h-dvh bg-neutral-50 px-4 py-6 text-neutral-900 md:px-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* LEFT: Event info */}
          <div className="md:col-span-4 border-b border-neutral-200 p-6 md:border-b-0 md:border-r md:p-8">
            <div className="text-xs font-medium text-neutral-500">
              {event ? "Scheduling" : "Loading"}
            </div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight">
              {event?.title || "Event"}
            </h1>
            {event?.description ? (
              <p className="mt-2 text-sm text-neutral-600">
                {event.description}
              </p>
            ) : null}

            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Duration</span>
                <span className="font-medium">{event?.duration ?? "-"}m</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Buffer</span>
                <span className="font-medium">{Number(event?.buffer_time || 0)}m</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Selected</span>
                <span className="font-medium">
                  {date && selectedSlot ? `${date} • ${selectedSlot}` : "—"}
                </span>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          {/* RIGHT: date + slots + form */}
          <div className="md:col-span-8 p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">Select a date</div>
                <input
                  type="date"
                  value={date}
                  min={today}
                  className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot("");
                  }}
                />
              </div>

              <div>
                <div className="text-sm font-semibold">Available times</div>
                <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-neutral-200 p-2">
                  {date ? (
                    slots.length === 0 ? (
                      <div className="p-3 text-sm text-neutral-600">
                        No available times.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${selectedSlot === slot
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                              }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="p-3 text-sm text-neutral-600">
                      Pick a date to see times.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-6">
              <div className="text-sm font-semibold">Your details</div>
              <div className="mt-3 grid gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <button
                  onClick={handleBooking}
                  disabled={!date || !selectedSlot || !form.name || !form.email}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  Confirm booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;