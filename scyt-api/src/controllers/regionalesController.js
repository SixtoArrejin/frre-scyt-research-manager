import {
  getAllRegionalesService,
} from '../services/regionalesService.js';

export async function getAllRegionales(req, res) {
  try {
    var regionales = await getAllRegionalesService();

    regionales = regionales.map(regional => regional.nombre);

    return res.status(200).json({ message: 'Regionales encontradas', success: true, regionales });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}