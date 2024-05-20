import { get, post, put, del } from "./baseApi";

// personasServices
export async function getProyectos() {
  return get(
    `/api/proyectos`
  );
}

export async function getProyectosByIdGrupo(idGrupo) {
  return get(`/api/proyectos/grupo/${idGrupo}`);
}

export async function getProyectosByPersonaId(personaId) {
  return get(`/api/proyectos/persona/${personaId}`);
}

export async function getProyectoById(idProyecto) {
  return get(`/api/proyectos/${idProyecto}`);
}

export async function createProyecto(data) {
  return post(`/api/proyectos/`, data);
}

export async function updatePID(id, data) {
  return put(`/api/proyectos/pid/${id}`, data);
}

export async function createVinculacion(id, data) {
  return post(`/api/proyectos/${id}/vinculaciones`, data);
}