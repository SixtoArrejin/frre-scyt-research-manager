import {
  getAllVinculacionesService,
  getVinculacionByIdService,
  createDesembolsoService,
  getDesembolsoByIdService,
  updateDesembolsoService,
  updateVinculacionService,
} from "../services/vinculacionesService.js";
import convertToISOString from "../utils/funciones.js";

export async function getAllVinculaciones(req, res) {
  try {
    const vinculaciones = await getAllVinculacionesService();
    return res
      .status(200)
      .json({ message: "Vinculaciones encontradas", success: true, vinculaciones });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getVinculacionesByProyectoId(req, res) {
  const { idProyecto } = req.params;
  try {
    const vinculaciones = await getAllVinculacionesService();
    console.log(vinculaciones)
    const vinculacionesFiltradas = vinculaciones.filter(
      (vinculacion) => vinculacion.idProyecto == idProyecto
    );

    return res
      .status(200)
      .json({ message: "Vinculaciones encontradas", success: true, vinculaciones: vinculacionesFiltradas });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getVinculacionById(req, res) {
  try {
    const {idVinculacion} = req.params;
    const vinculacionId = parseInt(idVinculacion);
    const vinculacion = await getVinculacionByIdService(vinculacionId);
    if (vinculacion){
      return res.status(200).json({ message: 'Vinculación encontrada', success: true, vinculacion });
    } else {
      return res.status(200).json({ message: `No se encuentran vinculaciones con id ${idVinculacion}`, success: true, vinculacion });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createDesembolso(req, res) {
  try {
    const desembolsoData = req.body;
    console.log(desembolsoData)
    const newDesembolso = await createDesembolsoService(desembolsoData);
    return res.status(201).json({ message: 'Desembolso creado exitosamente', success: true, newDesembolso });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getDesembolsoById(req, res) {
  try {
    const {idDesembolso} = req.params;
    const desembolsoId = parseInt(idDesembolso);
    const desembolso = await getDesembolsoByIdService(desembolsoId);
    return res.status(200).json({ message: 'Desembolso encontrado', success: true, desembolso });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function updateDesembolso(req, res) {
  const idDesembolso = parseInt(req.params.idDesembolso, 10);
  const desembolsoData = req.body;
  console.log(desembolsoData)
  try {
    const updateDesembolso = await updateDesembolsoService(idDesembolso, desembolsoData);
    return res.status(200).json({ message: 'Desembolso actualizado exitosamente', success: true, updateDesembolso });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function updateVinculacion(req, res) {
  const idVinculacion = parseInt(req.params.idVinculacion, 10);
  const vinculacionData = req.body;
  //grupoData.fechaCreacion = convertToISOString(grupoData.fechaCreacion); 

  try {
    const updatedVinculacion = await updateVinculacionService(idVinculacion, vinculacionData);
    return res.status(200).json({ message: 'Vinculacion actualizada exitosamente', success: true, updatedVinculacion });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}