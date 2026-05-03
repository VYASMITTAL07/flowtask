// ── API CONFIG ──────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('ft_token');
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── AUTH ─────────────────────────────────────────────────────
const Auth = {
  login:  (email, password) => request('POST', '/auth/login',  { email, password }),
  signup: (payload)         => request('POST', '/auth/signup', payload),
  me:     ()                => request('GET',  '/auth/me'),
};

// ── TASKS ─────────────────────────────────────────────────────
const Tasks = {
  getAll:  (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/tasks${q ? '?' + q : ''}`);
  },
  getOne:  (id)     => request('GET',    `/tasks/${id}`),
  create:  (data)   => request('POST',   '/tasks', data),
  update:  (id, data) => request('PATCH', `/tasks/${id}`, data),
  remove:  (id)     => request('DELETE', `/tasks/${id}`),
};

// ── PROJECTS ──────────────────────────────────────────────────
const Projects = {
  getAll:       ()        => request('GET',    '/projects'),
  getOne:       (id)      => request('GET',    `/projects/${id}`),
  create:       (data)    => request('POST',   '/projects', data),
  update:       (id, data)=> request('PATCH',  `/projects/${id}`, data),
  addMember:    (id, userId) => request('POST', `/projects/${id}/members`, { userId }),
  remove:       (id)      => request('DELETE', `/projects/${id}`),
};

// ── USERS ─────────────────────────────────────────────────────
const Users = {
  getAll:  ()           => request('GET',   '/users'),
  getOne:  (id)         => request('GET',   `/users/${id}`),
  update:  (id, data)   => request('PATCH', `/users/${id}`, data),
  remove:  (id)         => request('DELETE',`/users/${id}`),
};
