
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy load route pages to optimize bundle sizes and speed up initial page loads
const HomePage           = React.lazy(() => import('./pages/HomePage'));
const AboutPage          = React.lazy(() => import('./pages/AboutPage'));
const ServicesPage       = React.lazy(() => import('./pages/ServicesPage'));
const TestimonialsPage   = React.lazy(() => import('./pages/TestimonialsPage'));
const ContactPage        = React.lazy(() => import('./pages/ContactPage'));
const RatingPage         = React.lazy(() => import('./pages/RatingPage'));
const LoginPage          = React.lazy(() => import('./pages/auth/LoginPage'));
const SignupPage         = React.lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = React.lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage    = React.lazy(() => import('./pages/auth/VerifyEmailPage'));
const UserDashboard      = React.lazy(() => import('./pages/dashboard/UserDashboard'));
const ProfilePage        = React.lazy(() => import('./pages/ProfilePage'));
const AdminDashboard     = React.lazy(() => import('./pages/admin/AdminDashboard'));
const NotFoundPage       = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Layout><HomePage /></Layout>} />
                  <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                  <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
                  <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
                  <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
                  <Route
                    path="/rate"
                    element={
                      <ProtectedRoute>
                        <Layout><RatingPage /></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth pages (standalone - no Layout) */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                  
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

                  {/* 404 — catch all unmatched routes */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

