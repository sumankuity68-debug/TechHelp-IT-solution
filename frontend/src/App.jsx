
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';
import {
  ContentPageSkeleton,
  FormPageSkeleton,
  AuthPageSkeleton,
  DashboardPageSkeleton,
  ProfilePageSkeleton
} from './components/ui/Skeleton';

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
const ExpertDashboard    = React.lazy(() => import('./pages/dashboard/ExpertDashboard'));
const ProfilePage        = React.lazy(() => import('./pages/ProfilePage'));
const AdminDashboard     = React.lazy(() => import('./pages/admin/AdminDashboard'));
const NotFoundPage       = React.lazy(() => import('./pages/NotFoundPage'));
const PaymentSuccessPage = React.lazy(() => import('./pages/payment/PaymentSuccessPage'));
const PaymentCancelPage  = React.lazy(() => import('./pages/payment/PaymentCancelPage'));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Layout><Suspense fallback={<ContentPageSkeleton />}><HomePage /></Suspense></Layout>} />
                  <Route path="/about" element={<Layout><Suspense fallback={<ContentPageSkeleton />}><AboutPage /></Suspense></Layout>} />
                  <Route path="/services" element={<Layout><Suspense fallback={<ContentPageSkeleton />}><ServicesPage /></Suspense></Layout>} />
                  <Route path="/testimonials" element={<Layout><Suspense fallback={<ContentPageSkeleton />}><TestimonialsPage /></Suspense></Layout>} />
                  <Route path="/contact" element={<Layout><Suspense fallback={<ContentPageSkeleton />}><ContactPage /></Suspense></Layout>} />
                  <Route
                    path="/rate"
                    element={
                      <ProtectedRoute>
                        <Layout><Suspense fallback={<FormPageSkeleton />}><RatingPage /></Suspense></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth pages (standalone - no Layout) */}
                  <Route path="/login" element={<Suspense fallback={<AuthPageSkeleton />}><LoginPage /></Suspense>} />
                  <Route path="/signup" element={<Suspense fallback={<AuthPageSkeleton />}><SignupPage /></Suspense>} />
                  <Route path="/forgot-password" element={<Suspense fallback={<AuthPageSkeleton />}><ForgotPasswordPage /></Suspense>} />
                  <Route path="/reset-password/:token" element={<Suspense fallback={<AuthPageSkeleton />}><ResetPasswordPage /></Suspense>} />
                  <Route path="/verify-email/:token" element={<Suspense fallback={<AuthPageSkeleton />}><VerifyEmailPage /></Suspense>} />
                  
                  {/* Protected routes - User Dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout><Suspense fallback={<DashboardPageSkeleton />}><UserDashboard /></Suspense></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected routes - Expert Dashboard */}
                  <Route
                    path="/expert/dashboard"
                    element={
                      <ProtectedRoute requireExpert={true}>
                        <Layout><Suspense fallback={<DashboardPageSkeleton />}><ExpertDashboard /></Suspense></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected routes - Profile */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout><Suspense fallback={<ProfilePageSkeleton />}><ProfilePage /></Suspense></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Suspense fallback={<DashboardPageSkeleton />}><AdminDashboard /></Suspense>
                      </ProtectedRoute>
                    }
                  />

                  {/* Payment flows */}
                  <Route path="/payment/success" element={<Suspense fallback={<ContentPageSkeleton />}><PaymentSuccessPage /></Suspense>} />
                  <Route path="/payment/cancel" element={<Suspense fallback={<ContentPageSkeleton />}><PaymentCancelPage /></Suspense>} />

                  {/* 404 — catch all unmatched routes */}
                  <Route path="/404" element={<Suspense fallback={<ContentPageSkeleton />}><NotFoundPage /></Suspense>} />
                  <Route path="*" element={<Suspense fallback={<ContentPageSkeleton />}><NotFoundPage /></Suspense>} />
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

