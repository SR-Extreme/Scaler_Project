import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBooking } from "../services/api.js";

const Confirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(false);

  const bookingId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("bookingId");
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    if (state) return; // state already has details
    let isActive = true;
    setLoading(true);

    (async () => {
      try {
        const res = await getBooking(bookingId);
        if (!isActive) return;
        if (res.data.success) setRemote(res.data.data);
      } catch (err) {
        console.error(err);
        if (!isActive) return;
        setRemote(null);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [bookingId, state]);

  const details = state
    ? { name: state.name, date: state.date, time: state.time }
    : remote
      ? {
        name: remote.name,
        date: remote.booking_date,
        time: String(remote.start_time).slice(0, 5),
      }
      : null;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-lg rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
        <div className="text-sm font-semibold text-neutral-900">
          Booking confirmed
        </div>
        <div className="mt-1 text-sm text-neutral-600">
          We’ve reserved your time slot.
        </div>

        {loading ? (
          <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">
            Loading confirmation...
          </div>
        ) : details ? (
          <div className="mt-5 space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-neutral-600">Name</span>
              <span className="font-medium">{details.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-neutral-600">Date</span>
              <span className="font-medium">{details.date}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-neutral-600">Time</span>
              <span className="font-medium">{details.time}</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">
            Confirmation details not found.
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;