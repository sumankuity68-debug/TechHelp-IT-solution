// FILE: frontend/src/pages/HomePage.jsx
// Role-based home page:
//   admin  → AdminPortalHome  (internal portal, no marketing CTAs)
//   expert → ExpertPortalHome (expert portal)
//   user   → Hero             (public marketing page)

import { useAuth } from '../context/AuthContext';
import Hero from '../components/sections/Hero';
import AdminPortalHome  from '../components/sections/AdminPortalHome';
import ExpertPortalHome from '../components/sections/ExpertPortalHome';

export default function HomePage() {
  const { user } = useAuth();

  if (user?.role === 'admin')  return <AdminPortalHome />;
  if (user?.role === 'expert') return <ExpertPortalHome />;

  return (
    <div>
      <Hero />
    </div>
  );
}

