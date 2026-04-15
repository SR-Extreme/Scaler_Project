import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAvailableSlots,
  createBooking,
  getEvents,
} from "../services/api.js";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [event, setEvent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // Fetch event info
  const fetchEvent = async () => {
    const res = await getEvents();
    const found = res.data.data.find((e) => e.slug === slug);
    setEvent(found);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  // Fetch slots
  const fetchSlots = async () => {
    if (!date) return;

    try {
      const res = await getAvailableSlots(slug, date);
      if (res.data.success) {
        setSlots(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [date]);

  // Booking
  const handleBooking = async () => {
    if (!selectedSlot) return alert("Select a slot");

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
        navigate("/confirmation", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex">
        
        {/* LEFT: DATE */}
        <div className="w-1/2 p-6 border-r">
          <h2 className="text-xl font-semibold mb-4">
            Select Date
          </h2>

          <input
            type="date"
            className="border p-2 rounded-lg w-full"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* RIGHT: SLOTS + FORM */}
        <div className="w-1/2 p-6">
          
          <h2 className="text-xl font-semibold mb-4">
            Available Slots
          </h2>

          {/* Slots */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {slots.length === 0 ? (
              <p>No slots</p>
            ) : (
              slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border rounded-lg py-2 ${
                    selectedSlot === slot
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {slot}
                </button>
              ))
            )}
          </div>

          {/* Form */}
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded-lg w-full mb-3"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Your Email"
            className="border p-2 rounded-lg w-full mb-3"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <button
            onClick={handleBooking}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;