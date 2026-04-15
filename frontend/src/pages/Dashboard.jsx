import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";

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
    <AppShell
      title="Event types"
      right={
        <button
          onClick={() => navigate("/create-event")}
          className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
        >
          New event type
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
            No event types yet. Create your first one.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">
                    {event.title}
                  </h3>
                  {event.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                      {event.description}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-neutral-500">
                      No description
                    </p>
                  )}
                </div>
                <div className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-700">
                  {event.duration}m
                </div>
              </div>

              <div className="mt-2 text-xs text-neutral-600">
                Buffer: <span className="font-medium">{Number(event.buffer_time || 0)}m</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/book/${event.slug}`)}
                    className="text-sm font-medium text-neutral-900 hover:underline"
                  >
                    Open link
                  </button>
                  <button
                    onClick={() => navigate(`/edit-event/${event.id}`)}
                    className="text-sm font-medium text-neutral-900 hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
};

export default Dashboard;