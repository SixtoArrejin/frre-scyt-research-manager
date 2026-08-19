import { create, deleteByFilter, deleteById, update } from '../repository/baseRepository.js';
import {
  getAllProyectos,
  getProyectosPids,
  getProyectosExternos,
  getProyectoById,
  createProyecto,
  createProyectoPID,
  createTiene,
  createParticipa,
  createVinculacion,
  createVinculacionConFinanciamiento,
  createVinculacionSinFinanciamiento,
  createProyectoExterno,
  createRegionalesProyectos,
  createInstitucionesProyectos,
  deleteInstitucionesProyectosByProyecto,
  createPersonaParticipaProyecto,
  delPersonaParticipaProyecto,
  bajaPersonaParticipaProyecto,
  createProyectoTieneGrupo,
  delProyectoTieneGrupo,
  deletePid,
  deleteProyectoExterno,
} from '../repository/proyectosRepository.js';
import convertToISOString from '../utils/funciones.js';

export async function getAllProyectosService() {
  try {
    const proyectos = await getAllProyectos();

    const proyectoD = proyectos.map(proyecto => {
      const { pid, proyectoExterno, ...restoProyecto } = proyecto;
      if (proyecto.pid) {
        return {
          ...restoProyecto,
          ...pid,  // Añadir los atributos de pid al objeto proyecto
        };
      } else {
        return {
          ...restoProyecto,
          ...proyectoExterno,
        };
      }
    });

    return proyectoD;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProyectosPidsService() {
  try {
    const proyectosPids = await getProyectosPids();
    return proyectosPids;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProyectosExternosService(subtipo) {
  try {
    const proyectosExternos = await getProyectosExternos(subtipo);
    return proyectosExternos;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProyectoByIdService(idProyecto) {
  try {
    const proyecto = await getProyectoById(idProyecto);
    const { pid, proyectoExterno, ...restoProyecto } = proyecto;
    if (proyecto.pid) {
      return {
        ...pid,
        ...restoProyecto,
      };
    } else {
      return {
        ...proyectoExterno,
        ...restoProyecto,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoService(proyectoData) {
  const tipoProyectosConRegionales = [
    'Integrador Asociado (PID IA) con Incentivo',
    'Integrador Asociado (PID IA) sin Incentivo',
    'Inter-institucional (PID IN) con Incentivos',
    'Inter-institucional (PID IN) sin Incentivos',
    'PID Tecnología Educativa Multifacultad con Incentivos (PIDA)',
    'PID Tecnología Educativa Multifacultad sin Incentivos (PIDA)',
    'Tutorado con Incentivo',
    'Tutorado sin Incentivo',
  ];
  try {

    const { grupos, investigadores, regionales, ...dataProyecto } = proyectoData;

    const directores = investigadores?.filter((inv) => inv.rol === 'Director') || [];
    const codirector = investigadores?.find((inv) => inv.rol === 'CoDirector');

    if (directores.length === 0) {
      throw new Error('El Director es obligatorio');
    }
    if (directores.length > 1) {
      throw new Error('El Director debe ser único');
    }
    const director = directores[0];
    dataProyecto.idDirector = director.idPersona;
    dataProyecto.idCodirector = codirector ? codirector.idPersona : null;

    const newProyecto = await createProyecto(dataProyecto);
    newProyecto.grupos = [];
    newProyecto.integrantes = [];
    newProyecto.regionales = [];

    if (newProyecto) {

      if (grupos) {
        for (const grupo of grupos || []) {
          const newGroup = await createTieneService({
            idGrupoInvestigacion: grupo.idGrupoInvestigacion,
            idProyecto: newProyecto.idProyecto,
          });
          newProyecto.grupos.push(newGroup);
        }
      }

      if (investigadores) {
        for (const investigador of investigadores || []) {
          const newInvestigador = await createParticipaService({
            idProyecto: newProyecto.idProyecto,
            idPersona: investigador.idPersona,
            rol: investigador.rol,
            fechaInicio: convertToISOString(investigador.fechaInicio), //ACA ESTA EL ERROR SIXTO
          });
          newProyecto.integrantes.push(newInvestigador);
        }
      }


      if (tipoProyectosConRegionales.includes(newProyecto.tipoProyecto)) {
        for (const regional of regionales || []) {
          const newRegionalesProyectos = await createRegionalesProyectosService({
            idProyecto: newProyecto.idProyecto,
            nombreRegional: regional,
          });
          newProyecto.regionales.push(newRegionalesProyectos);
        }
      }

      // Agregar instituciones asociadas para proyectos interinstitucionales
      if (proyectoData.instituciones && proyectoData.instituciones.length > 0) {
        for (const nombreInstitucion of proyectoData.instituciones) {
          const newInstitucionProyecto = await createInstitucionesProyectosService({
            idProyecto: newProyecto.idProyecto,
            nombreInstitucion: nombreInstitucion,
          });
          if (!newProyecto.instituciones) {
            newProyecto.instituciones = [];
          }
          newProyecto.instituciones.push(newInstitucionProyecto);
        }
      }

    }

    return newProyecto;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createPidService(proyectoPidData) {
  try {
    console.log(proyectoPidData);
    const newProyectoPID = await createProyectoPID(proyectoPidData);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoExternoService(proyectoPidData) {
  try {
    const newProyectoPID = await createProyectoExterno(proyectoPidData);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createTieneService(dataTiene) {
  try {
    const newTiene = await createTiene(dataTiene);
    return newTiene;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createParticipaService(dataParticipa) {
  try {
    const newParticipacion = await createParticipa(dataParticipa);
    return newParticipacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createRegionalesProyectosService(dataP) {
  try {
    const newRP = await createRegionalesProyectos(dataP);
    return newRP;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createInstitucionesProyectosService(dataI) {
  try {
    const newIP = await createInstitucionesProyectos(dataI);
    return newIP;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateInstitucionesProyectoService(idProyecto, instituciones) {
  try {
    // Primero eliminar todas las instituciones existentes del proyecto
    await deleteInstitucionesProyectosByProyecto(idProyecto);
    
    // Luego crear las nuevas
    const institucionesCreadas = [];
    if (instituciones && instituciones.length > 0) {
      for (const nombreInstitucion of instituciones) {
        const newInstitucionProyecto = await createInstitucionesProyectos({
          idProyecto: idProyecto,
          nombreInstitucion: nombreInstitucion,
        });
        institucionesCreadas.push(newInstitucionProyecto);
      }
    }
    return institucionesCreadas;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function updateProyectoDataService(idProyecto, data) {
  try {
    let projectUpdate = {};
    const proyectoSearch = await getProyectoById(idProyecto);
    if (proyectoSearch && proyectoSearch.idProyecto) {
      if (data) {
        const dataProyecto = {
          ...(data.fechaInicio && { fechaInicio: convertToISOString(data.fechaInicio) }),
          ...(data.fechaFin && { fechaFin: convertToISOString(data.fechaFin) }),
          denominacion: data.denominacion,
          regional: data.regional,
          convocatoria: data.convocatoria,
          tipoProyecto: data.tipoProyecto || null,
          programa: data.programa,
          trl: data.trl || null,
          descripcionBreve: data.descripcionBreve || null,
        };

        const filter = { idProyecto: idProyecto };
        projectUpdate.proyecto = await update('proyectos', filter, dataProyecto);

        const esPidTarget = data.tipo ? data.tipo === 'pid' : Boolean(data.codPid);

        if (esPidTarget) {
          const dataPID = {
            idProyecto: idProyecto,
            codPid: data.codPid,
            tipoActividad: data.tipoActividad,
            completo: data.completo,
            estado: data.estado,
            disposicion: data.disposicion,
            prorrogado: data.prorrogado,
            ...(data.prorrogado && { nuevaDisposicion: data.nuevaDisposicion }),
            ...(data.prorrogado && { nuevaFechaFin: convertToISOString(data.nuevaFechaFin) }),
          };

          // Si anteriormente era un proyecto Externo, eliminar registro de proyectosExternos
          if (proyectoSearch.proyectoExterno) {
            await deleteProyectoExterno(idProyecto);
          }

          // Si ya poseía registro PID, actualizarlo; si no, crearlo
          if (proyectoSearch.pid) {
            projectUpdate.pid = await update('pids', { idPid: idProyecto }, {
              codPid: dataPID.codPid,
              tipoActividad: dataPID.tipoActividad,
              completo: dataPID.completo,
              estado: dataPID.estado,
              disposicion: dataPID.disposicion,
              prorrogado: dataPID.prorrogado,
              ...(data.prorrogado && { nuevaDisposicion: data.nuevaDisposicion }),
              ...(data.prorrogado && { nuevaFechaFin: convertToISOString(data.nuevaFechaFin) }),
            });
          } else {
            projectUpdate.pid = await createProyectoPID(dataPID);
          }
        } else {
          const dataExterno = {
            idProyecto: idProyecto,
            empresaInstitucion: data.empresaInstitucion,
          };

          // Si anteriormente era un PID, eliminar registro de pids
          if (proyectoSearch.pid) {
            await deletePid(idProyecto);
          }

          // Si ya poseía registro Externo, actualizarlo; si no, crearlo
          if (proyectoSearch.proyectoExterno) {
            projectUpdate.pid = await update('proyectosExternos', { idProyectoExterno: idProyecto }, {
              empresaInstitucion: data.empresaInstitucion,
            });
          } else {
            projectUpdate.pid = await createProyectoExterno(dataExterno);
          }
        }
      }
    } else {
      throw new Error(`El proyecto con id ${idProyecto} no existe`);
    }

    return projectUpdate;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function updatePidService(idProyecto, data) {
  return await updateProyectoDataService(idProyecto, data);
}

export async function updateProyectoExternoService(idProyecto, data) {
  return await updateProyectoDataService(idProyecto, data);
}

export async function createVinculacionService(idProyecto, dataVinculacion) {
  try {
    const newVinculacion = await createVinculacion(idProyecto, dataVinculacion);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createVinculacionSinFinanciamientoService(idVinculacion, vinculacionData) {
  try {
    const newVinculacion = await createVinculacionSinFinanciamiento(idVinculacion, vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createVinculacionConFinanciamientoService(idVinculacion, vinculacionData) {
  try {
    const newVinculacion = await createVinculacionConFinanciamiento(idVinculacion, vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createPersonaParticipaProyectoService(idProyecto, dataInvestigador) {
  try {
    const newParticipante = await createPersonaParticipaProyecto(idProyecto, dataInvestigador);
    return newParticipante;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function delPersonaParticipaProyectoService(idProyecto, idInvestigador) {
  try {
    const delParticipante = await delPersonaParticipaProyecto(idProyecto, idInvestigador);
    return delParticipante;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function bajaPersonaParticipaProyectoService(idProyecto, idInvestigador, fechaFin) {
  try {
    const bajaParticipante = await bajaPersonaParticipaProyecto(idProyecto, idInvestigador, fechaFin);
    return bajaParticipante;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function createProyectoTieneGrupoService(idProyecto, idGrupo) {
  try {
    const newGrupo = await createProyectoTieneGrupo(idProyecto, idGrupo);
    return newGrupo;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function delProyectoTieneGrupoService(idProyecto, idGrupo) {
  try {
    const delGrupo = await delProyectoTieneGrupo(idProyecto, idGrupo);
    return delGrupo;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}