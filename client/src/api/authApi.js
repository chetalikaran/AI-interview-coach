const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export function registerUser(formData) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export function loginUser(formData) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export function getCurrentUser(token) {
  return request('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
