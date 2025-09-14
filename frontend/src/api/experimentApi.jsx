const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export const getAssignment = async (payload) => {
  const r = await fetch(`${API_BASE}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('assignment failed');
  const data = await r.json();
  return data;
};

export const logEvent = async (payload) => {
  const r = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const txt = await r.text();
    console.error('log event failed', txt);
  }
  return r.json();
};
