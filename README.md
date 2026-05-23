# TechHelp IT Solutions

A full-stack IT agency web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features JWT-based authentication, a dynamic services system, contact form management, and an admin dashboard — all wired to a RESTful API backend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/mongodb-mongoose-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/express-4.x-000000?logo=express)
![Vite](https://img.shields.io/badge/vite-5.x-646CFF?logo=vite)

> 🚧 **Live Demo:** Coming soon — deployment in progress.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About

TechHelp IT Solutions is a production-style agency website where users can browse services, submit contact inquiries, register/login, and manage their profile. Admins get full CRUD control over services and contact submissions through protected API routes.

The goal of this project was to practice building a real-world monorepo with a separate frontend and backend, proper auth flows, and clean REST API design — the kind of setup you'd see in a small product team.

---

## Features

- **JWT Authentication** — Register, login, protected routes, role-based access (user/admin)
- **User Profile** — View and update name, phone, address, bio, and avatar
- **Services Management** — Public listing + admin-only create, update, delete
- **Contact Form** — Public submission with admin-only status management
- **Dark / Light Mode** — Persisted via localStorage, toggles across the full UI
- **3D Parallax Hero** — Mouse-reactive card animations on the landing page
- **Responsive Design** — Mobile-first layout across all pages
- **Form Validation** — Client-side validation on login, signup, and contact forms

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS + custom CSS variables |
| Backend | Node.js, Express 4 |
| Database | MongoDB (via Mongoose) |
| Auth | JWT + bcryptjs |
| Dev Tools | Nodemon, ESLint |

---

## Project Structure

```
TechHelp-IT-solution/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/          # Navbar, Footer
│       │   └── sections/        # Hero, About, Services, Testimonials, Contact
│       ├── context/             # Auth context provider
│       ├── hooks/               # Custom React hooks
│       ├── pages/
│       │   ├── auth/            # LoginPage, SignupPage
│       │   ├── dashboard/       # Admin dashboard
│       │   └── ProfilePage.jsx
│       ├── utils/               # Axios API helpers
│       ├── App.jsx
│       └── main.jsx
│
└── backend/
    ├── index.js                 # Express app entry point
    └── src/
        ├── config/              # MongoDB connection
        ├── controllers/         # Route handlers
        ├── middleware/          # JWT auth guard, admin check
        ├── models/              # Mongoose schemas
        └── routes/              # Express routers
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- npm

### 1. Clone the repository

```bash
git clone https://github.com/sumankuity68-debug/TechHelp-IT-solution.git
cd TechHelp-IT-solution
```

### 2. Setup the Backend

```bash
cd backend
npm install
cp ../.env.example .env
# Fill in your values in .env
npm run dev
```

Server starts at: `http://localhost:5000`

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## Environment Variables

Copy `.env.example` to `backend/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

See [`.env.example`](./.env.example) for the full reference.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and receive JWT token |
| `GET` | `/me` | Private | Get current logged-in user |
| `PUT` | `/profile` | Private | Update user profile |

### Services Routes — `/api/services`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | Get all active services |
| `POST` | `/` | Admin | Create a new service |
| `PUT` | `/:id` | Admin | Update a service |
| `DELETE` | `/:id` | Admin | Delete a service |

### Contact Routes — `/api/contact`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Public | Submit a contact inquiry |
| `GET` | `/` | Admin | Get all contact inquiries |
| `PUT` | `/:id` | Admin | Update inquiry status |
| `DELETE` | `/:id` | Admin | Delete an inquiry |

### Health Check

```
GET /api/health
```

---

## Roadmap

- [x] User authentication (JWT)
- [x] Services CRUD API
- [x] Contact form API
- [x] User profile update
- [ ] Admin dashboard UI
- [ ] Email notifications on contact form submission
- [ ] Deploy to Railway / Render + Vercel

---

## Contributing

Contributions, issues, and feature requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the [MIT License](./LICENSE).  
© 2025 Suman Kuity
