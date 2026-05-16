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

export function createInterviewSession({ token, resumeFileName, jobDescription }) {
  return request('/api/interviews/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resumeFileName,
      jobDescription,
    }),
  });
}

export function listInterviewSessions(token) {
  return request('/api/interviews/sessions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function submitAnswerFeedback({ token, sessionId, question, answer }) {
  return request(`/api/interviews/sessions/${sessionId}/answers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
      answer,
    }),
  });
}
