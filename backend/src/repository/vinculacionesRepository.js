import { getAll } from "./baseRepository.js";

export async function getAllVinculaciones() {
  const includeRelations = ["proyectos"];
  return await getAll("vinculaciones", includeRelations);
}