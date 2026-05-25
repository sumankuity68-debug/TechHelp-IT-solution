
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/layout/Layout';

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
import AdminDashboard from './pages/admin/admindashboard';

import ProtectedRoute from './components/ui/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
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
                  <Layout><UserDashboard /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
             <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            /> 
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;