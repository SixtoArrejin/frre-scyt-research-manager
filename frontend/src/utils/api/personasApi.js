import { get, post, put, del } from "./baseApi";

// personasServices
export async function getAllPersonas() {
  return get('/api/personas')
}

export async function getPersonaById(idPersona) {
  return get(`/api/personas/${idPersona}`)
}

export async function getPersonasByGroup(idGrupo) {
  return get(`/api/personas/grupo/${idGrupo}`)
}

export async function createPersona(data) {
  return post(`/api/personas`, data);
}

export async function updatePersona(id, data) {
  return put(`/api/personas/${id}`, data);
}

export async function deletePersona(id) {
  return del(`/api/personas/${id}`);
}