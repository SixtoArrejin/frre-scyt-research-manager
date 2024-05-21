import { get, post, put, del } from "./baseApi";

export async function getVinculaciones() {
  return get(
    `/api/vinculaciones`
  );
}

export async function getVinculacionByIdProyecto(idProyecto) {
  return get(`/api/vinculaciones/${idProyecto}`);
}