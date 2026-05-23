# Changelog

All notable changes to this project will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- Admin dashboard UI
- Email notifications on contact form submission
- Deployment to Railway (backend) + Vercel (frontend)

---

## [0.3.0] - 2025-05-23

### Added
- `contactController.js` — full CRUD for contact inquiries
- `servicesController.js` — full CRUD for services (admin-protected)
- `contact.js` model — Mongoose schema for contact submissions
- `service.js` model — Mongoose schema for IT services
- Auth, contact, and services route files under `src/routes/`
- JWT auth middleware (`protect`) and admin role guard (`admin`)
- MongoDB connection config (`src/config/db.js`)

### Changed
- Cleaned all comment lines from controller and model files
- Removed `.env` from git tracking (security fix)

---

## [0.2.0] - 2025-05-22

### Added
- User authentication — register, login, get profile, update profile
- `authcontroller.js` with JWT token generation
- `user.js` Mongoose model with bcrypt password hashing
- Auth middleware with Bearer token verification
- Express server entry point (`backend/index.js`) with CORS, JSON parsing, and 404 handler

---

## [0.1.0] - 2025-05-20

### Added
- Initial project structure — React + Vite frontend, Node.js + Express backend
- Frontend routing with React Router v6
- Landing page sections: Hero, About, Services, Testimonials, Contact
- Dark/Light mode toggle persisted in localStorage
- 3D parallax card animations on Hero section
- Login and Signup page UI
- User profile page
