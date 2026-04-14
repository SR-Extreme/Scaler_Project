import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/ConnectDB.js";
import eventRoutes from "./routes/eventRoutes.js"
import availabilityRoutes from "./routes/availabilityRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/events",eventRoutes);
app.use("/api/availability", availabilityRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
