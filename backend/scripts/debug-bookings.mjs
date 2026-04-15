import pool from "../config/postgres.js";

const date = process.argv[2] || "2026-04-21";
const time = process.argv[3] || "11:00";

const run = async () => {
  const qr = await pool.query(
    `select b.id,b.event_type_id,e.slug,b.booking_date,b.start_time,b.end_time,b.status,b.created_at
     from bookings b
     join event_types e on e.id=b.event_type_id
     where b.booking_date=$1 and b.start_time=$2
     order by b.id`,
    [date, time]
  );

  console.log({ date, time, count: qr.rows.length });
  console.table(
    qr.rows.map((r) => ({
      id: r.id,
      event_type_id: r.event_type_id,
      slug: r.slug,
      booking_date: r.booking_date,
      start_time: String(r.start_time).slice(0, 8),
      end_time: String(r.end_time).slice(0, 8),
      status: r.status,
    }))
  );
};

run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

