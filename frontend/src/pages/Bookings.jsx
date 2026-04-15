import { useEffect, useState } from "react";
import {
  getBookings,
  cancelBooking,
} from "../services/api.js";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

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
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <h1 className="text-2xl font-semibold mb-6">
        Bookings
      </h1>

      <div className="bg-white rounded-xl shadow p-4">
        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="border p-4 rounded-lg mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm text-gray-600">
                  {b.email}
                </p>
                <p className="text-sm">
                  {b.booking_date} | {b.start_time} - {b.end_time}
                </p>
                <p className="text-xs text-gray-500">
                  Status: {b.status}
                </p>
              </div>

              {b.status === "BOOKED" && (
                <button
                  onClick={() => handleCancel(b.id)}
                  className="text-red-500 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;