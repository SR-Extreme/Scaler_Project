import { useEffect, useState } from "react";
import {
  getBookings,
  cancelBooking,
} from "../services/api.js";
import AppShell from "../components/AppShell.jsx";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const ok = window.confirm("Are you sure you want to cancel this booking?");
      if (!ok) return;
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppShell title="Bookings">
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
            No bookings found.
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold">{b.name}</p>
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-700">
                    {b.status}
                  </span>
                </div>
                <p className="truncate text-xs text-neutral-600">{b.email}</p>
                <p className="mt-1 text-sm text-neutral-800">
                  {b.booking_date} • {String(b.start_time).slice(0, 5)} -{" "}
                  {String(b.end_time).slice(0, 5)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/confirmation?bookingId=${b.id}`)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
                >
                  View
                </button>
                {b.status === "BOOKED" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
};

export default Bookings;