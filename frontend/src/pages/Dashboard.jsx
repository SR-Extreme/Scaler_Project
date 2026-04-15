import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/api.js";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <div className="w-56 bg-black text-white p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Cal Clone</h2>

        <button
          onClick={() => navigate("/")}
          className="text-left hover:text-gray-300"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/create-event")}
          className="text-left hover:text-gray-300"
        >
          Create Event
        </button>

        <button
          onClick={() => navigate("/availability")}
          className="text-left hover:text-gray-300"
        >
          Availability
        </button>

        <button
          onClick={() => navigate("/bookings")}
          className="text-left hover:text-gray-300"
        >
          Bookings
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 bg-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Your Event Types
          </h1>

          <button
            onClick={() => navigate("/create-event")}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + New Event
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.length === 0 ? (
            <p>No events found</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white p-4 rounded-xl shadow-sm border"
              >
                <h3 className="text-lg font-semibold">
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {event.description}
                </p>

                <p className="text-sm mt-2">
                  {event.duration} mins
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      navigate(`/book/${event.slug}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;