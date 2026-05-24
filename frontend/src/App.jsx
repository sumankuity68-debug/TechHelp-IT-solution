// FILE: frontend/src/App.jsx
// ────────────────────────────────────────────────────────────────────────
// Main application router with Layout configurations + Authentication
// Week 2: Added AuthProvider, ProtectedRoute, and /dashboard
// ────────────────────────────────────────────────────────────────────────
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import RatingPage from './pages/RatingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/ui/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Core content routes wrapped with persistent Layout navbar/footer */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/rate" element={<Layout><RatingPage /></Layout>} />
          
          {/* Auth pages (standalone - no Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes - User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Week 3: Admin routes (coming soon) */}
          {/* <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;