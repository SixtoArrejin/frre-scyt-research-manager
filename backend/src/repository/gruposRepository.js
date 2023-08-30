import { getAll, getById, create } from "./baseRepository.js";
import { prisma } from "../db.js";

export async function getAllGrupos() {
  const includeRelations = ["personas", "tiene"];
  return await getAll("gruposinvestigacion", includeRelations);
}

export async function getGrupoById(idGrupoInvestigacion) {
  const includeRelations = [{ personas: ["categorias"]}, "tiene"];
  return await getById(
    "gruposinvestigacion",
    "idGrupoInvestigacion",
    idGrupoInvestigacion,
    includeRelations
  );
}

export async function createGrupo(grupoData) {
  try {
    const newGrupo = await create("gruposinvestigacion", grupoData);
    return newGrupo;
  } catch (error) {
    throw new Error(error.message);
  }
}
