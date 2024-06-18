import { get, post, put, del } from "./baseApi";

export async function getVinculaciones() {
  return get(
    `/api/vinculaciones`
  );
}

export async function getVinculacionByIdProyecto(idProyecto) {
  return get(`/api/vinculaciones/proyecto/${idProyecto}`);
}

export async function getVinculacionById(idVinculacion) {
  return get(`/api/vinculaciones/${idVinculacion}`);
}

export async function deleteConvenioById(idConvenio) {
  return del(`/api/convenios/${idConvenio}`)
}

export async function createDesembolsoByIdVinculacion(dataDesembolso) {
  return post('/api/vinculaciones/desembolsos', dataDesembolso)
}

export async function getDesembolsoById(idDesembolso) {
  return get(`/api/vinculaciones/desembolsos/${idDesembolso}`);
}