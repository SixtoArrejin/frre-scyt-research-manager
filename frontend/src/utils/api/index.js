// personasServices.js

export const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export async function getAllPersonas() {
  try {
    const response = await fetch('http://localhost:8000/api/personas');
    if (!response.ok) {
      throw new Error('Error al obtener los datos de personas.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error al obtener los datos de personas.');
  }
}
