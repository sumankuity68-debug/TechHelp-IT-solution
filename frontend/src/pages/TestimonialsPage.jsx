// FILE: frontend/src/pages/TestimonialsPage.jsx
// Dedicated route for the Testimonials section with a sticky rating header and compact reviews grid

import Testimonials from '../components/sections/Testimonials';

export default function TestimonialsPage() {
  return (
    <div>
      <Testimonials showStickyHeader={true} compactCards={true} />
    </div>
  );
}
