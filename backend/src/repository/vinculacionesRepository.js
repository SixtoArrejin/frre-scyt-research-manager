import { create, getAll, getById } from "./baseRepository.js";

export async function getAllVinculaciones() {
  const includeRelations = ["proyectos", "vinculacionesconfinanciamiento", "vinculacionessinfinanciamiento", "convenios"];
  return await getAll("vinculaciones", includeRelations);
}

export async function getVinculacionById(idVinculacion) {
  const includeRelations = [
    "proyectos",
    {vinculacionesconfinanciamiento: ["desembolsos"]},
    "vinculacionessinfinanciamiento",
    "convenios",
  ]
  return await getById('vinculaciones', 'idVinculacion', idVinculacion, includeRelations);
}

export async function createDesembolso(desembolsoData) {
  try {
    const newDesembolso = await create("desembolsos", desembolsoData);
    return newDesembolso;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDesembolsoById(idDesembolso) {
  return await getById(
    "desembolsos",
    "idDesembolso",
    idDesembolso,
  );
}