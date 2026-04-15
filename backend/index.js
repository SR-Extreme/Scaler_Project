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
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header) like health checks/Postman.
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    let isVercelOrigin = false;
    try {
      const hostname = new URL(normalizedOrigin).hostname;
      isVercelOrigin = hostname.endsWith(".vercel.app");
    } catch {
      isVercelOrigin = false;
    }

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    if (isVercelOrigin) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/overrides", overrideRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ") || "none configured"}`);
});
