import { readAllPersonasService } from '../services/personasService.js';

export async function getPersonas(req, res) {
  try {
    const personas = await readAllPersonasService();
    return res.status(200).json({ message: 'Personas encontradas', success: true, personas });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}