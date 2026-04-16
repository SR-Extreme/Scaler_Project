## Cal.com Clone (Scheduling Platform)

Fullstack scheduling/booking app inspired by Cal.com.

### Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **DB**: PostgreSQL (via `pg`)

### Core Features Implemented
- **Event types**: create/edit/delete, unique slug public link, per-event buffer time
- **Availability**: availability schedules + day/time ranges (overlapping ranges blocked; timezone is stored)
- **Public booking page**: date picker, available slots, booking form, double-booking prevention (`BOOKED` vs `CANCELLED`)
- **Bookings dashboard**: list bookings, cancel booking (sets status to `CANCELLED`), email notifications
- **(Bonus)**: date overrides (per-date availability/time window) + responsiveness

### Assumptions
- **No auth**: the admin side uses a fixed `user_id = 1` in the backend.
- **Booking status**: bookings use `status` values like `BOOKED`, `CANCELLED`.
- **Time handling**: past dates and past-time slots are blocked based on server-side `Date` comparison (day-of-week uses `YYYY-MM-DD` in UTC to avoid shifting).
- **Single host setup**: backend and frontend run locally using the default ports unless changed in `.env` (use `PORT` and `VITE_API_BASE_URL`, plus `FRONTEND_URL` for CORS).

### Setup

#### 1) Backend Setup
Create `backend/.env`:

```bash
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (choose ONE approach)

# Option A (recommended for deployments):
DATABASE_URL=postgresql://...

# Option B (local development):
DB_USER=postgres
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_password
DB_PORT=5432

# Email (EmailJS)
EMAILJS_SERVICE_ID=...
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...
EMAILJS_CONFIRM_TEMPLATE_ID=...
EMAILJS_CANCEL_TEMPLATE_ID=...
```

Install and start:

```bash
cd backend
npm install
npm start
```

The backend exposes APIs under `/api/*` (for example `/api/events`, `/api/availability`, `/api/bookings`, `/api/overrides`).

#### 2) Frontend Setup
Create `frontend/.env` (or update existing):

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

### Procedure / End-to-End Flow
Follow this exact order while using the app:

1. **Create Availability Schedule**
   - Go to `/availability`.
   - Enter an availability schedule name (for example: `Weekday Schedule`).
   - Click **Create**.

2. **Select That Availability Schedule**
   - In the **Select schedule** dropdown, choose the schedule you just created.

3. **Add Availability Slots**
   - Add day-wise time ranges (day, start time, end time, timezone).
   - Click **Add time range** for each slot.
   - You can add multiple slots; overlapping slots are blocked.

4. **Create Event Type**
   - Go to `/` (Dashboard: Event types) and click **New event type**, or visit `/create-event`.
   - Create an event type (title, duration, slug, etc.).
   - **Choose the availability schedule** created earlier for this event type.

5. **User Booking Flow**
   - Open the public booking link `/book/:slug`.
   - (Optional) Configure date overrides at `/overrides` to block or customize availability for specific dates.
   - User selects date -> selects available slot -> enters name/email -> confirms booking.
   - Booking is created and visible in `/bookings`.
   - Past dates and past-time slots are not selectable/bookable.

6. **Manage Bookings**
   - Go to `/bookings` to view all bookings.
   - Cancel a booking when required (status changes to `CANCELLED`).

### URLs
- **Admin (Dashboard + Management)**: `/` (event types), `/create-event`, `/edit-event/:id`, `/availability`, `/overrides`, `/bookings`
- **Public booking**: `/book/:slug`
- **Confirmation page**: `/confirmation`

