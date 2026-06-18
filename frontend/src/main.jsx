// FILE: frontend/src/main.jsx
// Entry point — renders App into the DOM

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
import { visitorsAPI } from './utils/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// ── Visitor ping — fires once per browser session ────────────────────────────
if (!sessionStorage.getItem('_vp')) {
  sessionStorage.setItem('_vp', '1');
  visitorsAPI.ping(); // silent fail — see api.js
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
