import {
    getAllTiposProyectosService
  } from "../services/tiposProyectosService.js";
  
  export async function getAllTiposProyectos(req, res) {
    try {
      var tiposProyectos = await getAllTiposProyectosService();
  
      tiposProyectos = tiposProyectos.map(tipo => tipo.tipoProyecto);
  
      return res.status(200).json({ message: 'Tipos de proyectos encontrados', success: true, tiposProyectos });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  }