import {
  getAllProyectosService,
  getProyectosPidsService,
  getProyectosExternosService,
  getProyectoByIdService,
  createProyectoService,
  createPIDService,
  createTieneService,
  createParticipaService
} from "../services/proyectosService.js";
import convertToISOString from "../utils/funciones.js";

export async function getProyectos(req, res) {
  try {
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
  }
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

    res
      .status(200)
      .json({
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

    res
      .status(200)
      .json({
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

    // Obtener todos los proyectos y luego filtrar por idGrupo
    const proyecto = await getProyectoByIdService(Number(idProyecto));
    // const proyectosFiltrados = proyectos.find(proyecto => proyecto.idProyecto === Number(idProyecto));

    res
      .status(200)
      .json({
        message: `Proyecto encontrado para el proyecto con ID ${idProyecto}.`,
        success: true,
        proyecto: proyecto,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function crearProyectosPID(req, res) {
  try {
    const { proyecto, pid, grupos, investigadores } = req.body;
    proyecto.fechaInicio = convertToISOString(proyecto.fechaInicio);
    proyecto.fechaFin = convertToISOString(proyecto.fechaFin);

    console.log("Pid: ", pid);
    console.log("Proyecto: ", proyecto);
    console.log("Grupos: ", grupos);
    console.log("Investigadores: ", investigadores);

    // Obtener todos los proyectos y luego filtrar por idGrupo
    // const proyecto = await getProyectoByIdService(Number(idProyecto));
    // const proyectosFiltrados = proyectos.find(proyecto => proyecto.idProyecto === Number(idProyecto));
    const project = {}
    const newProyecto = await createProyectoService(proyecto);
    project.proyecto = newProyecto;
    console.log("newProyecto: ", newProyecto);

    if (newProyecto) {
      const pidData = { idProyectoPid: newProyecto.idProyecto, ...pid };
      const newPID = await createPIDService(pidData);
      project.pid = newPID;

      project.grupos = []
      if (newPID) {
        // grupos?.map((grupo, index) => {
        //   const newGroup = await createTieneService({idGrupoInvestigacion: grupo.idGrupoInvestigacion, idProyecto: newProyecto.idProyecto})
        //   // console.log({idGrupoInvestigacion: grupo.idGrupoInvestigacion, idProyecto: newProyecto.idProyecto})
        //   project.grupos = [...project.grupos, newGroup]
        // })
        for (const grupo of grupos || []) {
          const newGroup = await createTieneService({
            idGrupoInvestigacion: grupo.idGrupoInvestigacion,
            idProyecto: newProyecto.idProyecto,
          });
          project.grupos.push(newGroup);
        }
      }

      project.investigadores = [];
      if (newPID) {
        const fechaInicioActividad = new Date(); //Implementar en la base de datos!!
        for (const investigador of investigadores || []) {
          const newInvestigador = await createParticipaService({
            idProyecto: newProyecto.idProyecto,
            idPersona: investigador.idPersona,
            rol: investigador.rol,
            // fechaInicioActividad: fechaInicioActividad
          });
          project.investigadores.push(newInvestigador);
        }
      }
    }
    res
      .status(200)
      .json({
        message: `Proyecto creado.`,
        success: true,
        proyecto: project,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}
