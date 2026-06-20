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

### 👨‍🏫 Evaluator / Testing Information
If you are evaluating this project, you can test the admin and payment features using the following credentials:
- **Admin Registration Code:** `TECHHELP2026ADMIN` *(Use this code during Sign Up to automatically get Admin privileges)*
- **Test Payment Card:** `4242 4242 4242 4242` (Any future expiration date, any 3-digit CVC)

---

## 📑 Table of Contents

- [Features](#-features)
- [Detailed Project Structure](#-detailed-project-structure)
  - [Frontend Components & Architecture](#frontend-components--architecture)
  - [Backend Controllers & Routes](#backend-controllers--routes)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Structure](#-database-structure)
- [License](#-license)

---

## ✨ Features

This platform goes beyond basic CRUD operations by implementing advanced, real-world features:

### 🔐 Advanced Authentication & Authorization
- **Role-Based Access Control:** Distinct dashboards and permissions for `user`, `expert`, and `admin`.
- **JWT & bcrypt:** Secure password encryption and session management.
- **Google OAuth Integration:** Seamless one-click login and registration.
- **Email OTP Verification:** Automated email verification for new accounts and secure password resets using **Nodemailer**.

### 💻 Dynamic Dashboards
- **Admin Panel:** Manage users, approve/deny expert applications, purge dummy accounts, view unique website visitor metrics, and manage service listings and contact inquiries.
- **Expert Portal:** A specialized dashboard for IT experts to manage their assigned inquiries and track statuses.
- **User Dashboard:** Personalized space to track service requests, book strategy meetings, and update profile information (including avatar uploads).

### 🎨 Modern UI/UX
- **Responsive Design:** 100% mobile-first, ensuring perfect rendering on all devices.
- **Dark/Light Mode:** Integrated theme toggling utilizing Context API and Vanilla CSS design tokens.
- **Micro-Animations:** Smooth, professional transitions and 3D parallax effects using **Framer Motion**.
- **AI Chatbot Integration:** Floating virtual assistant bubble accessible from any page.

### 💳 Integrations & Advanced Functionality
- **Payment Gateway:** Secure transaction processing using **Stripe**.
- **Automated Notifications:** Email alerts via Nodemailer for account changes, status updates, and meeting confirmations.
- **PDF Generation:** Dynamically generated invoices and reports using **PDFKit**.

---

## 📂 Detailed Project Structure

A clean, monorepo-style structure separating the client and server environments.

### Frontend Components & Architecture

The frontend is built with React 18 and Vite, structured into modular components and lazy-loaded routes for optimal performance.

```text
frontend/src/
├── App.jsx                     # Main application router and Context providers wrapper
├── index.css                   # Global CSS, Design System Tokens, Dark Mode Variables
│
├── components/                 # Reusable UI Elements
│   ├── layout/
│   │   ├── Layout.jsx          # Main page wrapper providing Navbar and Footer
│   │   ├── Navbar.jsx          # Responsive navigation bar with mobile menu
│   │   └── Footer.jsx          # Global footer
│   ├── sections/
│   │   ├── Hero.jsx            # Landing page 3D animated hero section
│   │   ├── Services.jsx        # IT Services display grid
│   │   ├── Contact.jsx         # Support/Inquiry form connected to backend
│   │   ├── AdminPortalHome.jsx # Special home view for Administrators
│   │   └── ExpertPortalHome.jsx# Special home view for Experts
│   ├── ui/
│   │   ├── Chatbot.jsx         # Floating AI Chatbot utilizing backend AI routes
│   │   ├── Toast.jsx           # Global popup notification system
│   │   ├── PageLoader.jsx      # Fallback UI for lazy-loaded routes
│   │   ├── ProtectedRoute.jsx  # Route guard for Auth/Role checking
│   │   └── Skeleton.jsx        # Loading skeleton animations
│
├── context/                    # React Context State Management
│   ├── AuthContext.jsx         # User session, JWT tokens, Login/Logout actions
│   ├── ThemeContext.jsx        # Dark/Light mode toggling
│   └── ToastContext.jsx        # Toast notification queue
│
├── pages/                      # Route-level Page Components
│   ├── HomePage.jsx            # Dynamic Home (renders Hero/AdminHome/ExpertHome based on role)
│   ├── AboutPage.jsx           # Company information
│   ├── ServicesPage.jsx        # Full catalog of services
│   ├── TestimonialsPage.jsx    # User reviews and ratings
│   ├── ContactPage.jsx         # Standalone contact page
│   ├── BookMeetingPage.jsx     # Expert 1-on-1 meeting scheduler
│   ├── ProfilePage.jsx         # User profile and password management
│   ├── NotFoundPage.jsx        # 404 Error screen
│   │
│   ├── admin/
│   │   └── AdminDashboard.jsx  # Comprehensive Admin CP (Tabs for Users, Services, Experts, Inquiries, Payments)
│   ├── dashboard/
│   │   ├── UserDashboard.jsx   # Standard user panel (Stats, Meeting history, Recent interactions)
│   │   └── ExpertDashboard.jsx # Dedicated expert panel for handling support tickets
│   │
│   ├── auth/                   # Authentication Flows
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── VerifyEmailPage.jsx
│   │
│   └── payment/
│       ├── PaymentSuccessPage.jsx
│       └── PaymentCancelPage.jsx
│
└── utils/
    ├── api.js                  # Centralized Axios/Fetch API wrappers for all backend calls
    └── animations.js           # Framer Motion animation variants
```

### Backend Controllers & Routes

The Node/Express backend follows the MVC (Model-View-Controller) pattern with distinct feature domains.

```text
backend/src/
├── index.js                    # Server entry point, DB connection, Middlewares
│
├── controllers/                # Core Business Logic
│   ├── authController.js       # Register, Login, Google OAuth, Email Verification, Password Reset
│   ├── userController.js       # CRUD for users, Role assignments, Purge API
│   ├── contactController.js    # Submitting inquiries, resolving tickets, tracking unique visitors
│   ├── expertController.js     # Managing expert applications, approvals, and assignments
│   ├── serviceController.js    # Creating and fetching available IT services
│   ├── meetingController.js    # Strategy session scheduling and confirmation emails
│   ├── paymentController.js    # Stripe Checkout sessions and webhooks
│   └── chatController.js       # AI Chatbot response generation
│
├── routes/                     # Express API Route Definitions
│   ├── auth.routes.js          # /api/auth/*
│   ├── user.routes.js          # /api/users/*
│   ├── contact.routes.js       # /api/contact/*
│   ├── expert.routes.js        # /api/experts/*
│   ├── service.routes.js       # /api/services/*
│   ├── chat.routes.js          # /api/chat/*
│   └── payment.routes.js       # /api/payment/*
│
├── middleware/
│   ├── auth.js                 # JWT Verification, `protect` and `admin`/`expert` guards
│   ├── validate.js             # Request body validation
│   ├── error.js                # Global error handling
│   └── rateLimiter.js          # Brute-force protection for Auth & Contact routes
│
└── models/                     # Mongoose Database Schemas
    ├── user.js
    ├── expert.js
    ├── service.js
    ├── contact.js
    ├── testimonial.js
    ├── order.js
    └── chatbotSettings.js
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Context API |
| **Styling & UI** | Vanilla CSS (CSS Modules & Variables), Framer Motion |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB & Mongoose |
| **Authentication**| JWT, bcryptjs, Google Auth Library |
| **Third-Party** | Stripe (Payments), Nodemailer (Email), Twilio (SMS), PDFKit |

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
ADMIN_SECRET_CODE=secret_registration_code_for_admins

# Email Configuration (Nodemailer via Brevo/SendGrid/Gmail)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_email@domain.com
EMAIL_FROM_NAME=TechHelp IT Solutions
FRONTEND_URL=http://localhost:5173

# Optional Integrations
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GEMINI_API_KEY=your_google_gemini_key_for_chatbot
```

---

## 🗄️ Database Structure

The project uses MongoDB with the following primary collections:
1. **Users:** Stores Name, Email, encrypted Password, Role (`user`, `expert`, `admin`), Avatar, and Address info.
2. **Experts:** Specialized collection storing expertise tags, assigned inquiries, and application status.
3. **Services:** Stores available IT Services, Descriptions, Pricing tiers, and expert assignments.
4. **Contacts:** Stores form submissions, Contact Name, Email, Message, Service requested, and Status (Pending/Resolved).
5. **Orders:** Stores Stripe Payment records, amounts, and statuses.
6. **Testimonials:** User reviews and ratings displayed on the marketing pages.

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).  
© 2026 Suman Kuity
