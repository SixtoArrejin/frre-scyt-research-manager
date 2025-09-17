import { get, post, put, del } from './baseApi';

// personasServices
export async function getAllGrupos() {
  return get('/api/grupos');
}

export async function getGrupoById(idPersona) {
  return get(`/api/grupos/${idPersona}`);
}

export async function createGrupo(data) {
  return post('/api/grupos', data);
}

export async function updateGrupo(id, data) {
  return put(`/api/grupos/${id}`, data);
}

export async function deleteGrupo(id) {
  return del(`/api/grupos/${id}`);
}
