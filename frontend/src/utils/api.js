// FILE: frontend/src/utils/api.js
// ────────────────────────────────────────────────────────────────────────
// Centralized API helper — all backend calls go through here.
// Uses relative /api paths so Vite proxy handles them in dev,
// and environment variable handles them in production.
// ────────────────────────────────────────────────────────────────────────

const BASE = '/api';

// ── Helper: get auth header ──────────────────────────────────────────────
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Helper: handle response ──────────────────────────────────────────────
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ═══════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════
export const authAPI = {
  login: (email, password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  register: (name, email, password) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE}/auth/me`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),
};

// ═══════════════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════════════
export const contactAPI = {
  submit: (form) =>
    fetch(`${BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(handleResponse),

  // Admin only
  getAll: () =>
    fetch(`${BASE}/contact`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  updateStatus: (id, status) =>
    fetch(`${BASE}/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/contact/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),
};

// ═══════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════
export const servicesAPI = {
  getAll: () =>
    fetch(`${BASE}/services`).then(handleResponse),

  // Admin only
  create: (service) =>
    fetch(`${BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(service),
    }).then(handleResponse),

  update: (id, service) =>
    fetch(`${BASE}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(service),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/services/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),
};
