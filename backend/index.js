import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/ConnectDB.js";
import eventRoutes from "./routes/eventRoutes.js"
import availabilityRoutes from "./routes/availabilityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import overrideRoutes from "./routes/overrideRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  })
);

app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/overrides", overrideRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
