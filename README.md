# 🚀 TechHelp IT Solutions

A complete, production-ready Full-Stack IT Agency web application built using the **MERN Stack** (MongoDB, Express, React, Node.js). This project was developed as a comprehensive internship submission, demonstrating industry-level proficiency in modern web development, secure authentication, database management, and responsive UI/UX design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/mongodb-mongoose-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/express-4.x-000000?logo=express)
![Vite](https://img.shields.io/badge/vite-5.x-646CFF?logo=vite)

> 🚀 **Live Demo (Frontend):** [https://techhelp-it-solution.vercel.app](https://techhelp-it-solution.vercel.app)
> ⚙️ **Live API (Backend):** [https://techhelp-backend.onrender.com](https://techhelp-backend.onrender.com)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Structure](#-database-structure)
- [License](#-license)

---

## ✨ Features

This platform goes beyond basic CRUD operations by implementing advanced, real-world features:

### 🔐 Advanced Authentication & Authorization
- **Role-Based Access Control:** Distinct dashboards and permissions for `Users`, `Experts`, and `Admins`.
- **JWT & bcrypt:** Secure password encryption and session management.
- **Google OAuth Integration:** Seamless one-click login and registration.
- **Email OTP Verification:** Automated email verification for new accounts and secure password resets using **Nodemailer**.

### 💻 Dynamic Dashboards
- **Admin Panel:** Manage users, approve/deny expert applications, and manage service listings and contact inquiries.
- **Expert Portal:** A specialized dashboard for IT experts to manage their tasks.
- **User Dashboard:** Personalized space to track service requests and update profile information (including avatar uploads).

### 🎨 Modern UI/UX
- **Responsive Design:** 100% mobile-first, ensuring perfect rendering on all devices.
- **Dark/Light Mode:** Integrated theme toggling utilizing Context API and Tailwind CSS.
- **Micro-Animations:** Smooth, professional transitions and 3D parallax effects using **Framer Motion**.

### 💳 Integrations & Advanced Functionality
- **Payment Gateway:** Secure transaction processing using **Stripe**.
- **Automated Notifications:** Email alerts via Nodemailer and SMS integrations via **Twilio**.
- **PDF Generation:** Dynamically generated invoices and reports using **PDFKit**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Context API |
| **Styling & UI** | Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB & Mongoose |
| **Authentication**| JWT, bcryptjs, Google Auth Library |
| **Third-Party** | Stripe (Payments), Nodemailer (Email), Twilio (SMS), PDFKit |

---

## 📂 Project Architecture

A clean, monorepo-style structure separating the client and server environments.

```
TechHelp-IT-solution/
├── frontend/                  # React + Vite Client
│   ├── src/
│   │   ├── components/        # Reusable UI components (Layouts, Forms, Sections)
│   │   ├── context/           # Global state (Auth, Theme, Toast)
│   │   ├── pages/             # Route-level components (Home, Dashboards, Auth)
│   │   ├── utils/             # Axios API helpers
│   │   └── App.jsx            # Main Router with lazy-loaded routes
│   └── package.json
│
└── backend/                   # Node + Express Server
    ├── src/
    │   ├── config/            # DB & Environment configs
    │   ├── controllers/       # Business logic (Auth, Services, Payments)
    │   ├── middleware/        # JWT Guards, Error Handling, Role Checks
    │   ├── models/            # Mongoose Schemas (User, Expert, Service, Request)
    │   ├── routes/            # Express endpoints
    │   └── utils/             # Helper functions (Email sender, Token generator)
    ├── index.js               # Server Entry Point
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/sumankuity68-debug/TechHelp-IT-solution.git
cd TechHelp-IT-solution
```

### 2. Backend Setup
```bash
cd backend
npm install
# Copy the example environment file and fill in your keys
cp .env.example .env
npm run dev
```
*The backend server will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will run on `http://localhost:5173`*

---

## 🔐 Environment Variables

You will need to configure your `.env` file in the `backend` directory. Here are the required keys:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional Integrations
STRIPE_SECRET_KEY=your_stripe_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 📡 API Reference (Core Routes)

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register a new user & trigger OTP |
| `POST` | `/auth/login` | Public | Authenticate user & return JWT |
| `POST` | `/auth/google` | Public | Authenticate via Google OAuth |
| `GET`  | `/services` | Public | Fetch all available IT services |
| `POST` | `/services` | Admin | Create a new service listing |
| `POST` | `/contact` | Public | Submit an inquiry/contact form |
| `GET`  | `/contact` | Admin | Fetch all contact submissions |
| `POST` | `/payment/create` | User | Initialize Stripe payment session |

---

## 🗄️ Database Structure

The project uses MongoDB with the following primary collections:
1. **Users:** Stores Name, Email, encrypted Password, Role (user/admin), Avatar, Address.
2. **Experts:** Specialized collection for IT staff, storing expertise areas and approval status.
3. **Services:** Stores Service Name, Description, Pricing, and Images.
4. **Inquiries/Contacts:** Stores Contact Name, Email, Message, and Status (Pending/Resolved).
5. **LoginRequests:** Manages expert login authorization requests pending Admin approval.

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).  
© 2026 Suman Kuity
