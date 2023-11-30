import {
  getAllProyectosService,
  getProyectosPidsService,
  getProyectosExternosService,
  getProyectoByIdService,
  createProyectoService,
  createPIDService,
  createTieneService,
  createParticipaService,
  updatePidService,
} from "../services/proyectosService.js";
import convertToISOString from "../utils/funciones.js";

export async function getProyectos(req, res) {
  try {
    const proyectos = await getAllProyectosService();
    return res
      .status(200)
      .json({ message: "Proyectos encontrados", success: true, proyectos });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
  /* try {
    const { tipo, subtipo } = req.query;
    console.log(tipo, subtipo);
    let proyectos;

    if (tipo === "pid") {
      proyectos = await getProyectosPidsService();
    } else if (tipo === "externo") {
      if (subtipo === "financiamiento") {
        proyectos = await getProyectosExternosService(subtipo);
      } else if (subtipo === "sinfinanciamiento") {
        proyectos = await getProyectosExternosService(subtipo);
      } else {
        proyectos = await getProyectosExternosService();
      }
    } else {
      proyectos = await getAllProyectosService();
    }

    res
      .status(200)
      .json({
        message: `Proyectos encontrados. ${tipo ? `Tipo: ${tipo} ${subtipo ? `- Subtipo: ${subtipo}` : ""} ` : ""
          }`,
        success: true,
        proyectos,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  } */
}

export async function getProyectosDeGrupo(req, res) {
  try {
    const { idGrupo } = req.params;
    console.log(idGrupo);

    // Obtener todos los proyectos y luego filtrar por idGrupo
    const proyectos = await getAllProyectosService();
    const proyectosFiltrados = proyectos.filter((proyecto) =>
      proyecto.tiene.some((item) => item.idGrupoInvestigacion == idGrupo)
    );

    res.status(200).json({
      message: `Proyectos encontrados para el idGrupoInvestigacion ${idGrupo}.`,
      success: true,
      proyectos: proyectosFiltrados,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function getProyectosDePersona(req, res) {
  try {
    const { personaId } = req.params;
    console.log(personaId);

    // Obtener todos los proyectos y luego filtrar por idGrupo
    const proyectos = await getAllProyectosService();
    const proyectosFiltrados = proyectos.filter((proyecto) =>
      proyecto.participa.some((item) => item.idPersona == personaId)
    );

    // Mapear los proyectos para mostrar solo el rol correspondiente al ID del proyecto actual
    const proyectosConRoles = proyectosFiltrados.map((proyecto) => {
      const participacion = proyecto.participa.find(
        (item) => item.idPersona == personaId
      );
      return {
        idProyecto: proyecto.idProyecto,
        tipoActividad: proyecto.tipoActividad,
        idProyecto: proyecto.idProyecto,
        tipoActividad: proyecto.tipoActividad,
        fechaInicio: proyecto.fechaInicio,
        fechaFin: proyecto.fechaFin,
        denominacion: proyecto.denominacion,
        completo: proyecto.completo,
        regional: proyecto.regional,
        convocatoria: proyecto.convocatoria,
        estado: proyecto.estado,
        rol: participacion.rol,
      };
    });

    res.status(200).json({
      message: `Proyectos encontrados para la personaId ${personaId}.`,
      success: true,
      proyectos: proyectosConRoles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function getProyectoPorId(req, res) {
  try {
    const { idProyecto } = req.params;
    console.log(idProyecto);

    const proyecto = await getProyectoByIdService(Number(idProyecto));
    // const proyectosFiltrados = proyectos.find(proyecto => proyecto.idProyecto === Number(idProyecto));
    proyecto.director = proyecto.personas_proyectos_idDirectorTopersonas;
    delete proyecto.personas_proyectos_idDirectorTopersonas;
    proyecto.codirector = proyecto.personas_proyectos_idCodirectorTopersonas;
    delete proyecto.personas_proyectos_idCodirectorTopersonas;
    res.status(200).json({
      message: `Proyecto encontrado para el proyecto con ID ${idProyecto}.`,
      success: true,
      proyecto: proyecto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function crearProyectos(req, res) {
  try {
    const dataProyecto = req.body;
    const newProyecto = await createProyectoService(dataProyecto);

    res
      .status(200)
      .json({
        message: `Proyecto creado.`,
        success: true,
        proyecto: newProyecto,
      });
    
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function updatePIDController(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const dataP = req.body;
  console.log(dataP);
  try {
    const updatedP = await updatePidService(idProyecto, dataP);
    return res
      .status(200)
      .json({
        message: "Proyecto actualizado exitosamente",
        success: true,
        updatedP,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
