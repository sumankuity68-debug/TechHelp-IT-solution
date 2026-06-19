# TechHelp IT Solutions - Project Details & Architecture Report

## 1. Introduction & Overview

**TechHelp IT Solutions** is a comprehensive, production-ready Full-Stack web application designed to manage an IT service agency. The platform facilitates direct interactions between standard users, dedicated IT experts, and system administrators. 

The application was built to demonstrate industry-standard practices in software engineering, featuring secure authentication, payment processing, role-based access control, and a responsive, dynamic user interface.

---

## 2. Technology Stack

The project is built on the **MERN** stack, augmented with modern tooling for a robust development and production experience.

| Layer | Technologies Used | Purpose |
|---|---|---|
| **Frontend Framework** | React.js (v18), Vite | Core UI library and build tool for fast rendering. |
| **Routing & State** | React Router v6, Context API | Client-side routing and global state management. |
| **Styling & UI** | Vanilla CSS, Framer Motion | Custom design tokens, dark mode, and complex 3D/micro-animations. |
| **Backend Server** | Node.js, Express.js | RESTful API creation and server-side logic. |
| **Database** | MongoDB, Mongoose | NoSQL database for flexible schema management. |
| **Authentication** | JWT, bcryptjs, Google OAuth | Secure session management and password hashing. |
| **Third-Party APIs** | Stripe, Nodemailer, Gemini AI | Payment processing, automated emails, and AI Chatbot. |

---

## 3. Detailed Project Structure

The project utilizes a monorepo architecture, clearly separating the client (`frontend`) and the server (`backend`).

### 3.1 Frontend Architecture (`/frontend`)

The React application is modularly structured to promote reusability and clean code. Route-level components are lazy-loaded to optimize bundle sizes.

```text
frontend/src/
├── App.jsx                     # Core router, Lazy Loading, and Provider Wrapper
├── index.css                   # Global styles, CSS Variables, Theme system
│
├── components/                 # Reusable UI Architecture
│   ├── layout/
│   │   ├── Layout.jsx          # Main page wrapper (Navbar + Content + Footer)
│   │   ├── Navbar.jsx          # Adaptive navigation based on Auth role
│   │   └── Footer.jsx          # Global site footer
│   ├── sections/
│   │   ├── Hero.jsx            # Landing page with 3D Framer Motion effects
│   │   ├── Services.jsx        # Grid display of available IT services
│   │   ├── Contact.jsx         # Contact form with backend validation
│   │   ├── AdminPortalHome.jsx # Specialized landing page for Admins
│   │   └── ExpertPortalHome.jsx# Specialized landing page for IT Experts
│   └── ui/
│       ├── Chatbot.jsx         # Floating AI Assistant widget
│       ├── Toast.jsx           # Global notification popup system
│       ├── ProtectedRoute.jsx  # Route guard validating JWT and Role claims
│       └── Skeleton.jsx        # Loading placeholders for Suspense boundaries
│
├── context/                    # Global State Management
│   ├── AuthContext.jsx         # Manages user session, login, and logout
│   ├── ThemeContext.jsx        # Manages Light/Dark mode preferences
│   └── ToastContext.jsx        # Manages global UI notifications
│
├── pages/                      # Top-Level Route Components
│   ├── HomePage.jsx            # Dynamic entry point based on user role
│   ├── AboutPage.jsx           # Static company info
│   ├── ServicesPage.jsx        # Full service catalog
│   ├── TestimonialsPage.jsx    # User reviews display
│   ├── BookMeetingPage.jsx     # Scheduling interface for expert consultations
│   ├── ProfilePage.jsx         # User account management and avatar upload
│   │
│   ├── admin/                  # Administrator Views
│   │   └── AdminDashboard.jsx  # Tabbed interface for managing all platform data
│   │
│   ├── dashboard/              # Role-Specific Dashboards
│   │   ├── UserDashboard.jsx   # Standard user order and meeting history
│   │   └── ExpertDashboard.jsx # Ticket management for IT staff
│   │
│   ├── auth/                   # Authentication Views
│   │   ├── LoginPage.jsx       # Email/Password & Google Login
│   │   ├── SignupPage.jsx      # Registration form
│   │   └── ResetPasswordPage.jsx
│   │
│   └── payment/                # Stripe Checkout Views
│       ├── PaymentSuccessPage.jsx
│       └── PaymentCancelPage.jsx
│
└── utils/
    ├── api.js                  # Centralized Axios/Fetch API wrappers
    └── animations.js           # Shared Framer Motion variants
```

### 3.2 Backend Architecture (`/backend`)

The Node.js server follows the Model-View-Controller (MVC) pattern, ensuring separation of concerns between route definitions, business logic, and database interactions.

```text
backend/src/
├── index.js                    # Server entry, CORS config, MongoDB connection
│
├── controllers/                # Core Business Logic
│   ├── authController.js       # Handles Registration, Login, OTPs, and OAuth
│   ├── userController.js       # Handles User CRUD, Role updates, and Bulk purges
│   ├── contactController.js    # Handles Inquiries and Unique Visitor tracking
│   ├── expertController.js     # Handles Expert approvals and ticket assignments
│   ├── serviceController.js    # Handles Service catalog management
│   ├── meetingController.js    # Handles Consultation scheduling
│   ├── paymentController.js    # Handles Stripe Webhooks and Session creation
│   └── chatController.js       # Interfaces with Gemini API for the Chatbot
│
├── routes/                     # Express Endpoint Definitions
│   ├── auth.routes.js          # Routes for /api/auth
│   ├── user.routes.js          # Routes for /api/users
│   ├── contact.routes.js       # Routes for /api/contact
│   ├── expert.routes.js        # Routes for /api/experts
│   ├── service.routes.js       # Routes for /api/services
│   ├── chat.routes.js          # Routes for /api/chat
│   └── payment.routes.js       # Routes for /api/payment
│
├── middleware/                 # Request Interceptors
│   ├── auth.js                 # Verifies JWTs and enforces Role checks (Admin/Expert)
│   ├── validate.js             # Validates incoming JSON payloads
│   ├── error.js                # Global error formatting
│   └── rateLimiter.js          # Prevents brute-force attacks on Auth endpoints
│
├── models/                     # MongoDB Schemas (Mongoose)
│   ├── user.js                 # Stores credentials, roles, and profiles
│   ├── expert.js               # Links to User, stores skills and approval state
│   ├── service.js              # Stores IT service details and pricing
│   ├── contact.js              # Stores user inquiries and resolution status
│   └── order.js                # Stores transactional payment data
│
└── utils/                      # Server Utilities
    ├── sendEmail.js            # Nodemailer configuration
    └── paginate.js             # Reusable pagination logic for large collections
```

---

## 4. Key Feature Implementation

### 4.1 Role-Based Access Control (RBAC)
The application strictly segregates functionality based on three roles:
1. **User:** Can browse services, submit inquiries, book meetings, and process payments.
2. **Expert:** Must be manually approved by an Admin. They access a dedicated portal to view and resolve assigned technical inquiries.
3. **Admin:** Possesses unrestricted access. Can purge databases, modify user roles, edit service catalogs, and view system-wide financial and traffic analytics.

Both the Frontend (`ProtectedRoute.jsx`) and Backend (`auth.js` middleware) enforce these boundaries independently to ensure complete security.

### 4.2 Security & Authentication
- Passwords are salted and hashed using `bcryptjs` before reaching the database.
- Sessions are maintained losslessly via `JWT` (JSON Web Tokens) stored in `localStorage` and transmitted via HTTP headers.
- Account creation triggers a secure OTP email loop using `Nodemailer` to verify human identity.

### 4.3 Analytics & Dashboards
The Admin Dashboard aggregates data in real-time. It computes:
- **Total Registered Users** (filtered specifically to exclude staff accounts)
- **Unique Website Visitors** (aggregating unique email signatures from contact points)
- **Financial Processing** (interfacing with Stripe to track successful checkouts)

### 4.4 Artificial Intelligence Integration
A global floating widget (`Chatbot.jsx`) is available to logged-in users. It transmits conversational history to the backend (`chatController.js`), which interfaces with the Google Gemini AI API to provide real-time, context-aware technical assistance.
