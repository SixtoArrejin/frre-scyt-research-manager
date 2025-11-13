import {
  getAllPropiedadIntelectualService,
  getPropiedadIntelectualByIdService,
  createPropiedadIntelectualService,
  updatePropiedadIntelectualService,
  deletePropiedadIntelectualService,
} from '../services/propiedadIntelectualService.js';

export async function getAllPropiedadIntelectual(req, res) {
  try {
    const propiedadIntelectual = await getAllPropiedadIntelectualService();
    return res
      .status(200)
      .json({ message: 'Propiedad intelectual encontrada', success: true, propiedadIntelectual });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getPropiedadIntelectualByProyectoId(req, res) {
  const { idProyecto } = req.params;
  try {
    const propiedadIntelectual = await getAllPropiedadIntelectualService();
    const piFiltrada = propiedadIntelectual.filter(
      (pi) => pi.idProyecto == idProyecto,
    );

    return res
      .status(200)
      .json({ message: 'Propiedad intelectual encontrada', success: true, propiedadIntelectual: piFiltrada });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getPropiedadIntelectualById(req, res) {
  try {
    const { idPI } = req.params;
    const piId = parseInt(idPI);
    const pi = await getPropiedadIntelectualByIdService(piId);
    if (pi) {
      return res.status(200).json({ message: 'Propiedad intelectual encontrada', success: true, propiedadIntelectual: pi });
    } else {
      return res.status(200).json({ message: `No se encuentra propiedad intelectual con id ${idPI}`, success: true, propiedadIntelectual: pi });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createPropiedadIntelectual(req, res) {
  try {
    const piData = req.body;
    console.log(piData);
    const newPI = await createPropiedadIntelectualService(piData);
    return res.status(201).json({ message: 'Propiedad intelectual creada exitosamente', success: true, propiedadIntelectual: newPI });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function updatePropiedadIntelectual(req, res) {
  const idPI = parseInt(req.params.idPI, 10);
  const piData = req.body;
  console.log(piData);
  try {
    const updatedPI = await updatePropiedadIntelectualService(idPI, piData);
    return res.status(200).json({ message: 'Propiedad intelectual actualizada exitosamente', success: true, propiedadIntelectual: updatedPI });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function deletePropiedadIntelectual(req, res) {
  const idPI = parseInt(req.params.idPI, 10);
  try {
    const deleted = await deletePropiedadIntelectualService(idPI);
    return res.status(200).json({ message: 'Propiedad intelectual eliminada exitosamente', success: true, deleted });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
