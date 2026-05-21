# TechHelp IT Solutions — Full-Stack Agency Website

TechHelp IT Solutions is a professional IT services agency platform designed to deliver premium custom software, cloud architecture, and web development. This project features a responsive frontend built on **React + Vite**, a clean visual design supporting dynamic **Light/Dark modes**, interactive **3D parallax visual elements**, and a custom **client rating system**.

---

## Folder Structure

```
├── frontend/                         # React frontend application
│   ├── index.html                    # Root HTML template with theme init script
│   ├── package.json                  # Dependencies & scripts
│   ├── vite.config.js                # Vite build and proxy config
│   ├── tailwind.config.js            # Tailwind styling config
│   ├── postcss.config.js             # PostCSS rules
│   │
│   └── src/
│       ├── main.jsx                  # Application entry point
│       ├── App.jsx                   # React Router definition and routes
│       ├── index.css                 # Global styles, fonts, and CSS variable design tokens
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx        # Sticky top navigation with mobile-style theme toggle
│       │   │   └── Footer.jsx        # Branding footer with links and social references
│       │   │
│       │   └── sections/             # Interactive sections used on landing page
│       │       ├── Hero.jsx          # Interactive hero with 3D parallax dashboard widgets
│       │       ├── About.jsx         # Firm background, vision, and core capabilities
│       │       ├── Services.jsx      # Service offerings grid
│       │       ├── Testimonials.jsx  # Client review carousel with mouse tilt effects
│       │       └── Contact.jsx       # Contact form + phone, email, and social networks
│       │
│       ├── pages/                    # Dedicated route components
│       │   ├── HomePage.jsx          # Root landing page "/"
│       │   ├── ContactPage.jsx       # Dedicated contact and project startup page "/contact"
│       │   ├── TestimonialsPage.jsx  # Dedicated testimonials list "/testimonials"
│       │   ├── RatingPage.jsx        # Client rating submission portal "/rate"
│       │   │
│       │   └── auth/                 # Authentication pages
│       │       ├── LoginPage.jsx     # User login interface "/login"
│       │       └── SignupPage.jsx    # User registration interface "/signup"
│       │
│       ├── context/                  # Authentication state providers
│       ├── hooks/                    # Reusable custom React hooks
│       └── utils/                    # Client API helper functions
│
└── backend/                          # Express + Node.js server
    └── src/
        ├── routes/                   # Router endpoints (Auth, Contact, Inquiries)
        ├── controllers/              # Business logic controllers
        ├── models/                   # MongoDB schema models (User, Inquiries)
        ├── middleware/               # Auth guards (JWT verification)
        └── config/                   # Database (Mongoose) setup configurations
```

---

## Key Features

- **Pill-Style Theme Switcher**: Toggle between light and dark modes with a custom sliding switch modeled after mobile OS toggles. Theme choice persists across reloads via `localStorage`.
- **3D Card Parallax Visuals**: The Hero and Testimonial cards react to mouse movement via custom 3D transforms (`rotateX` / `rotateY`) and smooth CSS transitions.
- **Client Feedback & Rating Portal**: An interactive star rating selector with hover state feedback and response confirmation.
- **Multi-Route Navigation**: Fully routed multi-page architecture using `react-router-dom` with constant Navbar/Footer and quick home return options.
- **Form Validations**: Advanced client-side input validations on Login, Signup, and Contact forms.

---

## Technical Stack & Configuration

- **Core**: React, Vite, ES6 Javascript
- **Routing**: `react-router-dom` (Version 6)
- **Styling**: Tailwind CSS & custom Vanilla CSS variable design tokens
- **Typography**: Fraunces (serif for editorial headings) & DM Sans (geometric sans-serif for UI layout and body copy)
- **Backend Architecture**: Ready for Node.js + Express with MongoDB and JWT-based authentication.

---

## Installation and Setup

### 1. Run the Frontend
Navigate to the frontend folder, install dependencies, and launch the Vite development server:
```bash
# Move to frontend
cd frontend

# Install package dependencies
npm install

# Run the local server
npm run dev
```

The app will run locally at: [http://localhost:5173/](http://localhost:5173/)

### 2. Build for Production
To bundle the frontend application for production:
```bash
npm run build
```
This generates optimized static assets inside the `frontend/dist/` directory.

---

## Core Design Decisions

- **Color Tokens**: Refactored hardcoded colors into responsive design tokens using CSS variables (`--bg-primary`, `--text-primary`, `--accent-color`).
  - *Light Mode*: Sleek white/slate background with dark slate text and vivid royal blue accents.
  - *Dark Mode*: Deep charcoal/black background with clean off-white text and responsive bright blue highlights.
- **Borders & Layout**: Removed complex background grids in favor of minimal, clean card borders, maintaining a high-fidelity visual aesthetic.
