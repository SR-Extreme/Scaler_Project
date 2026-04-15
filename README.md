## Cal.com Clone (Scheduling Platform)

Fullstack scheduling/booking app inspired by Cal.com.

### Tech stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **DB**: PostgreSQL (via `pg`)

### Core features implemented
- **Event types**: create/list/delete, unique slug public link
- **Availability**: schedules + day/time ranges
- **Public booking page**: date picker, available slots, booking form, double-booking prevention
- **Bookings dashboard**: list bookings, cancel booking (sets status to `CANCELLED`)
- **(Bonus)**: date overrides + reschedule API endpoints exist in backend

### Assumptions
- **No auth**: the admin side uses a fixed `user_id = 1` in the backend.
- **Booking status**: bookings use `status` values like `BOOKED`, `CANCELLED`, `RESCHEDULED`.

### Setup

#### 1) Backend
Create `backend/.env`:

```bash
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ScalerDatabase
DB_PASSWORD=your_password
DB_PORT=5432
```

Install and start:

```bash
cd backend
npm install
npm run start
```

Backend runs at `http://localhost:5000` (or your `PORT`).

#### Database (schema + seed)

From your PostgreSQL client, run:

```sql
-- schema
\i backend/db/schema.sql

-- seed (sample event types + bookings)
\i backend/db/seed.sql
```

#### 2) Frontend
Optionally create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Install and start:

```bash
cd frontend
npm install
npm run dev
```

Open the app at the Vite URL (shown in terminal).

### URLs
- **Admin**: `/` (Event types), `/availability`, `/bookings`
- **Public booking**: `/book/:slug`

