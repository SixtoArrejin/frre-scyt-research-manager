import { get, post, put, del } from "./baseApi";

// personasServices
export async function getProyectos(tipo, subtipo) {
  return get(
    `/api/proyectos${
      tipo ? "?tipo=" + tipo + (subtipo ? "&subtipo=" + subtipo : "") : ""
    }`
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

export async function createProyectoPID(data) {
  return post(`/api/proyectos/pid`, data);
}

export async function updatePID(id, data) {
  return put(`/api/proyectos/pid/${id}`, data);
}