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

  export async function getProyectosDeGrupo(req, res) {
    try {
      const { idGrupo } = req.params;
      console.log(idGrupo);
  
      // Obtener todos los proyectos y luego filtrar por idGrupo
      const proyectos = await getAllProyectosService();
      const proyectosFiltrados = proyectos.filter(proyecto => proyecto.tiene.some(item => item.idGrupoInvestigacion == idGrupo));
  
      res.status(200).json({ message: `Proyectos encontrados para el idGrupoInvestigacion ${idGrupo}.`, success: true, proyectos: proyectosFiltrados });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }
  

  
  