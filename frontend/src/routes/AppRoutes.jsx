import { Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "../pages/Dashboard.jsx";
import CreateEvent from "../pages/CreateEvent.jsx";
import EditEvent from "../pages/EditEvent.jsx";
import Availability from "../pages/Availability.jsx";
import BookingPage from "../pages/BookingPage.jsx";
import Bookings from "../pages/Bookings.jsx";
import Confirmation from "../pages/Confirmation.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/availability" element={<Availability />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/book/:slug" element={<BookingPage />} />
      <Route path="/book/*" element={<BookingPage />} />
      <Route path="/confirmation" element={<Confirmation />} />
    </Routes>
  );
};

export default AppRoutes;