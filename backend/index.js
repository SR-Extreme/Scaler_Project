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
app.use(cors());

app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/overrides", overrideRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
