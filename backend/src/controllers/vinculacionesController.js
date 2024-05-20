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