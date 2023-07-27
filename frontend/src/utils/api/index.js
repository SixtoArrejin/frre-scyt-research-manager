// personasServices.js

export const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// services/api.js

async function fetchData(url, options) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function get(url) {
  return fetchData(url);
}

export function post(url, data) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return fetchData(url, options);
}

// Define otras funciones para PUT, DELETE, etc.


export async function getAllPersonas() {
  return get('/api/personas')
}
