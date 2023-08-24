import {
    getAllProyectosService,
    getProyectosPidsService,
    getProyectosExternosService
  } from '../services/proyectosService.js';
  
  export async function getProyectos(req, res) {
    try {
      const { tipo } = req.query;
  
      let proyectos;
  
      if (tipo === 'pids') {
        proyectos = await getProyectosPidsService();
      } else if (tipo === 'externos') {
        proyectos = await getProyectosExternosService();
      } else {
        proyectos = await getAllProyectosService();
      }
  
      res.status(200).json({ message: 'Proyectos encontrados', success: true, proyectos });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }
  