import { getAll, getById } from "./baseRepository.js";

export async function getAllVinculaciones() {
  const includeRelations = ["proyectos", "vinculacionesconfinanciamiento", "vinculacionessinfinanciamiento"];
  return await getAll("vinculaciones", includeRelations);
}

export async function getVinculacionById(idVinculacion) {
  const includeRelations = ["proyectos", "vinculacionesconfinanciamiento", "vinculacionessinfinanciamiento"]
  return await getById('vinculaciones', 'idVinculacion', idVinculacion, includeRelations);
}