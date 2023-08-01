import { getAllPersonasService, createPersonaService, updatePersonaService, getPersonaByIdService } from '../services/personasService.js';

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
    const {idPersona} = req.params;
    const personaId = parseInt(idPersona);
    const persona = await getPersonaByIdService(personaId);
    return res.status(200).json({ message: 'Persona encontrada', success: true, persona });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createPersona(req, res) {
  try {
    const personaData = req.body;
    const newPersona = await createPersonaService(personaData);
    return res.status(201).json({ message: 'Persona creada exitosamente', success: true, newPersona });
  } catch (error) {
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