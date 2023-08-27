import {
    getAllProyectosService,
    getProyectosPidsService,
    getProyectosExternosService
  } from '../services/proyectosService.js';
  
  export async function getProyectos(req, res) {
    try {
      const { tipo, subtipo } = req.query;
      console.log(tipo, subtipo);
      let proyectos;
  
      if (tipo === 'pid') {
        proyectos = await getProyectosPidsService();
      } else if (tipo === 'externo') {
        if (subtipo === 'financiamiento') {
          proyectos = await getProyectosExternosService(subtipo);
        } else if (subtipo === 'sinfinanciamiento') {
          proyectos = await getProyectosExternosService(subtipo);
        } else {
          proyectos = await getProyectosExternosService();
        }
      } else {
        proyectos = await getAllProyectosService();
      }
  
      res.status(200).json({ message: `Proyectos encontrados. ${tipo ? `Tipo: ${tipo} ${subtipo ? `- Subtipo: ${subtipo}` : ""} ` : "" }`, success: true, proyectos });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }
  