## Cal.com Clone (Scheduling Platform)

Fullstack scheduling/booking app inspired by Cal.com.

### Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **DB**: PostgreSQL (via `pg`)

### Core Features Implemented
- **Event types**: create/list/delete, unique slug public link
- **Availability**: schedules + day/time ranges
- **Public booking page**: date picker, available slots, booking form, double-booking prevention
- **Bookings dashboard**: list bookings, cancel booking (sets status to `CANCELLED`)
- **(Bonus)**: date overrides + responsiveness + Multiple availability schedules + Email notifications on booking confirmation/cancellation + Buffer time between meetings 

### Assumptions
- **No auth**: the admin side uses a fixed `user_id = 1` in the backend.
- **Booking status**: bookings use `status` values like `BOOKED`, `CANCELLED`.
- **Timezone behavior**: slot filtering and past-date/past-time blocking are based on server/client current local time handling.
- **Single host setup**: backend and frontend run locally using the default ports unless changed in `.env`.

### Setup

#### 1) Backend Setup
Create `backend/.env`:

```bash
PORT=5000
DB_USER=postgres
DB_HOST=your-render-postgres-host
DB_NAME=DB_Name
DB_PASSWORD=your_password
DB_PORT=5432
```

Install and start:

```bash
cd backend
npm install
npm start
```

Backend runs at your configured domain and `PORT`.

#### 2) Frontend Setup
Optionally create `frontend/.env`:

```bash
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
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
   - Go to `/` (Event types page).
   - Create an event type (title, duration, slug, etc.).
   - **Choose the availability schedule** created earlier for this event type.

5. **User Booking Flow**
   - Open the public booking link `/book/:slug`.
   - User selects date -> selects available slot -> enters name/email -> confirms booking.
   - Booking is created and visible in `/bookings`.
   - Past dates and past-time slots are not selectable/bookable.

6. **Manage Bookings**
   - Go to `/bookings` to view all bookings.
   - Cancel a booking when required (status changes to `CANCELLED`).

### URLs
- **Admin**: `/` (Event types), `/availability`, `/bookings`
- **Public booking**: `/book/:slug`

