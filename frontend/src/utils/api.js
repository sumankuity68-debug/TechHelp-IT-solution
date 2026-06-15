// FILE: frontend/src/utils/api.js
// ────────────────────────────────────────────────────────────────────────
// Centralized API helper — all backend calls go through here.
// Uses relative /api paths so Vite proxy handles them in dev,
// and environment variable handles them in production.
// ────────────────────────────────────────────────────────────────────────

const BASE = '/api';

// ── Helper: build query string from params object (omits null/undefined) ────────
const buildQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') q.append(k, v);
  });
  const str = q.toString();
  return str ? `?${str}` : '';
};

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

  getMy: () =>
    fetch(`${BASE}/contact/mine`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  // Admin only — supports pagination: { page, limit, sort, status, search }
  getAll: (params = {}) =>
    fetch(`${BASE}/contact${buildQuery(params)}`, {
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

// ═══════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════
export const testimonialsAPI = {
  // Paginated public fetch: { page, limit, sort, rating }
  getAll: (params = {}) =>
    fetch(`${BASE}/testimonials${buildQuery(params)}`).then(handleResponse),

  // Return all without pagination (admin use)
  getAll_nopaginate: () =>
    fetch(`${BASE}/testimonials?all=true`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  vote: (id, data) =>
    fetch(`${BASE}/testimonials/${id}/vote`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  reply: (id, data) =>
    fetch(`${BASE}/testimonials/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// ═══════════════════════════════════════════════════════════════════════
// USERS (Admin only)
// ═══════════════════════════════════════════════════════════════════════
export const usersAPI = {
  // Paginated: { page, limit, sort, search, role }
  getAll: (params = {}) =>
    fetch(`${BASE}/users${buildQuery(params)}`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  updateRole: (id, role) =>
    fetch(`${BASE}/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ role }),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// ═══════════════════════════════════════════════════════════════════════
// EXPERTS
// ═══════════════════════════════════════════════════════════════════════
export const expertsAPI = {
  getAll: () =>
    fetch(`${BASE}/experts`).then(handleResponse),

  create: (expert) =>
    fetch(`${BASE}/experts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(expert),
    }).then(handleResponse),

  update: (id, expert) =>
    fetch(`${BASE}/experts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(expert),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/experts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  approve: (id) =>
    fetch(`${BASE}/experts/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  getMyInquiries: () =>
    fetch(`${BASE}/experts/my-inquiries`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    }).then(handleResponse),

  updateInquiryStatus: (id, status) =>
    fetch(`${BASE}/experts/inquiries/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
};
