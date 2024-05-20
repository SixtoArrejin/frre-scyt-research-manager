import { getAll } from "./baseRepository.js";

export async function getAllVinculaciones() {
  const includeRelations = ["proyectos", "vinculacionesconfinanciamiento", "vinculacionessinfinanciamiento"];
  return await getAll("vinculaciones", includeRelations);
}