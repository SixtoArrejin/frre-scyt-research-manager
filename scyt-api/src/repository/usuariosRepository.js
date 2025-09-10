import { getAll, create } from "./baseRepository.js";
import { prisma } from "../db.js";

export async function getAllUsuarios() {
  return await getAll("usuarios");
}

export async function createUsuario(personaData) {
  try {
    const newPersona = await create("usuarios", personaData);
    return newPersona;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateUsuario(usuario, userData) {
  try {
    const updatedUsuario = await prisma.usuarios.update({
      where: { usuario },
      data: userData,
    });
    return updatedUsuario;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteUsuario(usuario) {
  try {
    await prisma.usuarios.update({
      where: { usuario },
      data: { activo: false },
    });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getByUsername(username) {
  try {
    const usuarioData = await prisma.usuarios.findUnique({
      where: { usuario: username },
    });
    return usuarioData;
  } catch (error) {
    throw new Error(error.message);
  }
}
