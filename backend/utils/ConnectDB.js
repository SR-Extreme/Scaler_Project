import pool from "../config/postgres.js";
import initSchema from "./initSchema.js";

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected");

    const res = await client.query("SELECT NOW()");
    console.log("DB Time:", res.rows[0].now);

    client.release();
    await initSchema();
    console.log("Schema check complete");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;