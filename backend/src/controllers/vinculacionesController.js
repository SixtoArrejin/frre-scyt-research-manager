import {
  getAllVinculacionesService,
} from "../services/vinculacionesService.js";

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