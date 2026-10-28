# 🎬 IMovies - Movie Ticket Booking Made Simple

> **Full Stack MERN Cinema Platform**  
> Browse movies, select showtimes, reserve seats with real-time availability tracking, and generate digital admission tickets with QR codes.

---

## 📋 Project Overview & Architecture

**IMovies** is a full-stack movie ticket reservation web application engineered using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Bootstrap 5. It delivers a fast client-server architecture for theater schedules, seat concurrency handling, user authentication via JWT, and administrative management.

### Project Breakdown
- **Epics:** 6 Completed (Project Architecture, Project Setup, Backend Development, Database Development, Frontend Development, Project Execution)
- **Verified Tasks:** 19 Tasks
- **Complexity:** Medium
- **Primary Domain:** Entertainment / Ticketing E-Commerce

---

## 🛠️ Technology Stack & Skills

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Bootstrap 5, Bootstrap Icons, Lucide Icons, Canvas Confetti, QRCode |
| **Backend** | Node.js (v24), Express.js REST API, JSON Web Token (JWT), bcryptjs, CORS |
| **Database** | MongoDB & Mongoose ORM |
| **Styling** | Modern Cinematic Dark Theme (`#090d16`), Glassmorphism, Curved Cinema Screen |

---

## ✨ Key Features

1. **Movie Catalog & Search:**
   - Filter by "Now Showing" and "Coming Soon" tabs.
   - Filter by genre pills (*Action, Sci-Fi, Drama, Adventure, Comedy, Animation, Biography*).
   - Real-time search query matching titles, directors, and actors.
   - Featured blockbuster hero carousel with embedded video trailer modals.

2. **Cinema & Showtime Scheduling:**
   - Browse partner multiplexes (*IMovies Luxe Times Square, Grand Megaplex, Cineplex Brooklyn*).
   - Filter showtimes by consecutive calendar dates.
   - Screen format indicators (*IMAX 3D, Dolby Atmos®, 4K Laser Projection*).

3. **Interactive Real-Time Auditorium Seat Selection:**
   - Visual curved cinema screen display (*"Screen This Way"*).
   - Tiered seat matrix:
     - **VIP Recliners** (Rows A-B): `$22.00`
     - **Premium Seats** (Rows C-E): `$16.00`
     - **Standard Seats** (Rows F-H): `$12.00`
   - Real-time status indicators: **Available**, **Selected** (emerald highlight), **Reserved/Sold** (locked).
   - Concurrency protection: Atomic verification preventing duplicate reservations.

4. **Cart & Seamless Checkout:**
   - Live ticket subtotal and convenience fee calculation.
   - Optional cinema snacks add-on (*Caramel & Butter Popcorn, Fountain Soda, Loaded Nachos*).
   - Loyalty credits redemption discount (*$5.00 OFF with 50 credits*).
   - Simulated payment gateway (*Credit Card, Google Pay / Apple Pay, UPI / Net Banking*).

5. **Digital E-Ticket Gate Passes:**
   - Perforated authentic movie ticket styling.
   - Live QR Code and unique booking reference (*e.g., `IMOV-XXXX12`*).
   - One-click ticket printing / saving.

6. **User Account & Ticket Management:**
   - JWT authentication with secure password hashing.
   - 1-Click quick demo login for instant testing.
   - "My Bookings" page with active and cancelled history.
   - Cancellation with instant seat release back to the auditorium pool.

7. **Admin Management Panel:**
   - Real-time metrics: Gross Box Office revenue, tickets sold, active movies, total bookings.
   - Movie management: Create new movies with posters/backdrops or delete entries.
   - Showtime management: Schedule new theater slots with custom date, time, and pricing.
   - Customer reservations table with attendee breakdown.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v16 or above (v24 supported)
- **npm** v8 or above
- **MongoDB** (local `mongod` on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Installation
Dependencies are already installed in both `backend` and `frontend`. To reinstall if needed:
```bash
npm run install:all
```

### 3. Database Configuration & Seeding
Create `backend/.env` (pre-configured template provided):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026
```

Seed initial blockbuster movies, theaters, showtimes, and demo credentials:
```bash
npm run seed
```

### 4. Running the Application

To launch both backend server and frontend client concurrently:
```bash
node start.js
```
Or start them individually:
- **Backend Server:**
  ```bash
  npm run server
  # Runs at http://localhost:5000 (API at http://localhost:5000/api)
  ```
- **Frontend Client:**
  ```bash
  npm run client
  # Runs at http://localhost:3000
  ```

---

## 🔑 Default Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Demo User** | `user@imovies.com` | `password123` | Browse, reserve seats, redeem loyalty credits, view & cancel e-tickets |
| **Administrator** | `admin@imovies.com` | `admin123` | View revenue, create/delete movies, schedule showtimes, inspect bookings |

*(You can also use the **"1-Click Instant Demo Login"** buttons in the Sign In modal.)*

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status and uptime |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | User login & JWT generation |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `GET` | `/api/movies` | Public | List movies with genre/search filtering |
| `GET` | `/api/movies/:id` | Public | Movie details and available showtimes |
| `POST` | `/api/movies` | Admin | Create new movie entry |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie and associated showtimes |
| `GET` | `/api/cinemas` | Public | List partner theaters & screen formats |
| `GET` | `/api/showtimes` | Public | List showtimes by date/movie/cinema |
| `GET` | `/api/showtimes/:id` | Public | Showtime details with real-time seat availability |
| `POST` | `/api/showtimes` | Admin | Schedule a new showtime slot |
| `POST` | `/api/bookings` | Private | Reserve seats with collision check |
| `GET` | `/api/bookings/my-bookings`| Private | Retrieve user's bookings |
| `GET` | `/api/bookings/:id` | Private | Get single booking confirmation / pass |
| `PUT` | `/api/bookings/:id/cancel`| Private | Cancel booking and release seats |
| `GET` | `/api/bookings` | Admin | View all bookings & revenue metrics |

