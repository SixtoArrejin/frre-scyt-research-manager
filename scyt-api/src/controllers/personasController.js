import { getAllPersonasService, createPersonaService, updatePersonaService, getPersonaByIdService, getPersonaByGroupService } from '../services/personasService.js';
import convertToISOString from '../utils/funciones.js';

export async function getPersonas(req, res) {
  try {
    const personas = await getAllPersonasService();
    return res.status(200).json({ message: 'Personas encontradas', success: true, personas });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getPersonasById(req, res) {
  try {
    const { idPersona } = req.params;
    const personaId = parseInt(idPersona);
    const persona = await getPersonaByIdService(personaId);
    return res.status(200).json({ message: 'Persona encontrada', success: true, persona });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getPersonasByGroup(req, res) {
  try {
    const { idGrupo } = req.params;
    const idgrupo = parseInt(idGrupo);
    const personasGrupo = await getPersonaByGroupService(idgrupo);
    return res.status(200).json({ message: 'Personas encontradas', success: true, personasGrupo });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createPersona(req, res) {
  try {
    const personaData = { fechaIngreso: new Date(), ...req.body };

    // const fechaActual = new Date();
    // personaData.fechaIngreso = "2023-08-30T00:00:00.000Z"
    // console.log(convertToISOString(fechaActual));
    console.log(personaData);
    // personaData.fechaIngreso = convertToISOString(fechaActual);

    const newPersona = await createPersonaService(personaData);
    return res.status(201).json({ message: 'Persona creada exitosamente', success: true, newPersona });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function updatePersonaController(req, res) {
  const idPersona = parseInt(req.params.idPersona, 10);
  const personaData = req.body;

  try {
    const updatedPersona = await updatePersonaService(idPersona, personaData);
    return res.status(200).json({ message: 'Persona actualizada exitosamente', success: true, updatedPersona });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}