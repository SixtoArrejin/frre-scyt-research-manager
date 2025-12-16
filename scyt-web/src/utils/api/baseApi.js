export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// baseServices

function joinApiUrl(baseUrl, path) {
  const base = String(baseUrl || '').replace(/\/+$/, '');
  const rawPath = String(path || '');
  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

  const baseEndsWithApi = base.endsWith('/api');
  const pathStartsWithApi = normalizedPath === '/api' || normalizedPath.startsWith('/api/');

  if (baseEndsWithApi && pathStartsWithApi) {
    const withoutDupApi = normalizedPath.replace(/^\/api(?=\/|$)/, '');
    return `${base}${withoutDupApi || '/'}`;
  }

  return `${base}${normalizedPath}`;
}

async function parseErrorResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(bodyText);
    } catch {
      return { message: bodyText };
    }
  }

  return { message: bodyText };
}

async function fetchData(url, options = {}) {
  const token = await localStorage.getItem('token');
  options.headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };

  const response = await fetch(joinApiUrl(API_URL, url), options);

  if (!response.ok) {
    const errorData = await parseErrorResponse(response);
    throw new Error(errorData?.message || `Error HTTP ${response.status}`);
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

export function put(url, data) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return fetchData(url, options);
}

export function del(url) {
  const options = {
    method: 'DELETE',
  };
  return fetchData(url, options);
}
