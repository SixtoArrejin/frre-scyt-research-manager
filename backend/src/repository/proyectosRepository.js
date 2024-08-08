import { getAll, create, update, getById } from './baseRepository.js';
import { prisma } from '../db.js';
import convertToISOString from '../utils/funciones.js';

export async function getAllProyectos() {
  const includeRelations = ['participa', 'personas_proyectos_idDirectorTopersonas', 'personas_proyectos_idCodirectorTopersonas', 'tiene'];
  return await getAll('proyectos', includeRelations);
}

export async function getProyectosPids() {
  const includeRelations = ["proyectos"];
  return await getAll('pids', includeRelations);
}

export async function getProyectosExternos(subtipo = null) {
  if (subtipo === 'financiamiento') {
    const includeRelations = [{ proyectosexternos: ["proyectos"] }];
    return await getAll('proyectosconfinanciamiento', includeRelations);
  };
  //falta el caso en que el subtipo='sinFinanciamiento' pero aún no implementamos esa tabla
  const includeRelations = ['proyectos', 'proyectosconfinanciamiento'];
  return await getAll('proyectosexternos', includeRelations);
}

export async function getProyectoById(idProyecto) { //SACAR CODIRECTOR
  const includeRelations = ['personas_proyectos_idDirectorTopersonas', 'personas_proyectos_idCodirectorTopersonas', { participa: [{ personas: ['categorias'] }] }, { tiene: ['gruposinvestigacion'] }];
  return await getById('proyectos', 'idProyecto', idProyecto, includeRelations);
}

export async function createProyecto(proyectoData) {
  try {
    const proyectoPayload = {
      fechaInicio: proyectoData.fechaInicio,
      fechaFin: proyectoData.fechaFin,
      denominacion: proyectoData.denominacion,
      regional: proyectoData.regional,
      convocatoria: proyectoData.convocatoria,
      idDirector: proyectoData.idDirector,
      tipoProyecto: proyectoData.tipoProyecto,
      programa: proyectoData.programa,
    };

    // Codirector podría no estar
    if (proyectoData.idCodirector) {
      proyectoPayload.idCodirector = proyectoData.idCodirector;
    }

    const newProyecto = await create('proyectos', proyectoPayload);
    return newProyecto;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoPID(proyectoPIDData) {
  try {
    const proyectoPayload = {
      idPid: proyectoPIDData.idProyecto,
      codPid: proyectoPIDData.codPid,
      tipoActividad: proyectoPIDData.tipoActividad,
      completo: proyectoPIDData.completo,
      estado: proyectoPIDData.estado,
      disposicion: proyectoPIDData.disposicion,
      prorrogado: proyectoPIDData.prorrogado
    };

    const newProyectoPID = await create('pids', proyectoPayload);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoExterno(proyectoExternoData) {
  try {
    const proyectoPayload = {
      idProyectoExterno: proyectoExternoData.idProyecto
    };

    const newProyectoPID = await create('proyectosExternos', proyectoPayload);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createTiene(tieneData) {
  try {
    const newTine = await create('tiene', tieneData);
    return newTine;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createParticipa(dataParticipa) {
  try {
    const newParticipacion = await create('participa', dataParticipa);
    return newParticipacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteParticipa(idProyecto) {
  try {
    const deletedProyectos = await prisma.participa.delete({
      where: { idProyecto },
    });
    return deletedProyectos;
  } catch (error) {
    throw new Error(`Error al eliminar la categoría de la BD: ${error.message}`);
  }
}

export async function createVinculacion(idProyecto, dataVinculacion) {
  const vinculacionData = {
    empresaInstitucion: dataVinculacion.empresaInstitucion,
    numeroMarco: dataVinculacion.nroMarco,
    idProyecto: idProyecto
  }
  console.log(vinculacionData)
  try {
    const newVinculacion = await create('vinculaciones', vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createVinculacionSinFinanciamiento(idVinculacion, dataVinculacion) {
  const fechaInicioISO = new Date(dataVinculacion.fechaInicio).toISOString(); // Convertir a ISO-8601
  const fechaCierreISO = new Date(dataVinculacion.fechaCierre).toISOString(); // Convertir a ISO-8601
  const vinculacionData = {
    idSinFinanciamiento: idVinculacion,
    fechaInicio: fechaInicioISO,
    fechaCierre: fechaCierreISO,
    descripcion: dataVinculacion.descripcion,
  }
  console.log(vinculacionData)
  try {
    const newVinculacion = await create('vinculacionessinfinanciamiento', vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createVinculacionConFinanciamiento(idVinculacion, dataVinculacion) {
  const vinculacionData = {
    idConFinanciamiento: idVinculacion,
    titulo: dataVinculacion.titulo,
    estado: "En ejecución",
    motivoEstado: null,
    monto: dataVinculacion.monto,
    plazoEjecucion: dataVinculacion.plazoEjecucion,
    nombreBeneficiario: dataVinculacion.beneficiario,
    cantidadDesembolsos: dataVinculacion.desembolsos,
    fechaPresentacion: new Date(dataVinculacion.presentacion).toISOString(),
    fechaAdjudicacion: new Date(dataVinculacion.adjudicacion).toISOString(),
  }
  console.log(vinculacionData)
  try {
    const newVinculacion = await create('vinculacionesconfinanciamiento', vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}