import { update } from "../repository/baseRepository.js";
import {
  getAllVinculaciones,
  getVinculacionById,
  createDesembolso,
  getDesembolsoById,
} from "../repository/vinculacionesRepository.js";
import convertToISOString from "../utils/funciones.js";

export async function getAllVinculacionesService() {
  try {
    const vinculaciones = await getAllVinculaciones();
    return vinculaciones;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getVinculacionByIdService(idVinculacion) {
  try {
    const vinculacion = await getVinculacionById(idVinculacion);
    return vinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createDesembolsoService(desembolsoData) {
  try {
    desembolsoData.fechaDesembolso = convertToISOString(
      desembolsoData.fechaDesembolso
    );
    // desembolsoData.fechaAprobado = convertToISOString(desembolsoData.fechaAprobado);
    desembolsoData.estado = "En ejecución";
    console.log(desembolsoData.fechaDesembolso);
    const newDesembolso = await createDesembolso(desembolsoData);
    return newDesembolso;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDesembolsoByIdService(idDesembolso) {
  try {
    const desembolso = await getDesembolsoById(idDesembolso);
    return desembolso;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateDesembolsoService(idDesembolso, desembolsoData) {
  try {
    const filter = { idDesembolso };
    if (desembolsoData.fechaDeRendicionReal === "") {
      desembolsoData.fechaDeRendicionReal = null;
    } else if (desembolsoData.fechaDeRendicionReal) {
      desembolsoData.fechaDeRendicionReal = convertToISOString(
        desembolsoData.fechaDeRendicionReal
      );
    }

    if (desembolsoData.fechaAprobado === "") {
      desembolsoData.fechaAprobado = null;
    } else if (desembolsoData.fechaAprobado) {
      desembolsoData.fechaAprobado = convertToISOString(
        desembolsoData.fechaAprobado
      );
    }

    if (desembolsoData.fechaDesembolso === "") {
      desembolsoData.fechaDesembolso = null;
    } else if (desembolsoData.fechaDesembolso) {
      desembolsoData.fechaDesembolso = convertToISOString(
        desembolsoData.fechaDesembolso
      );
    }
    console.log("pepe", desembolsoData);
    const updatedDesembolso = await update(
      "desembolsos",
      filter,
      desembolsoData
    );
    return updatedDesembolso;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function updateVinculacionService(idVinculacion, vinculacionData) {
  try {
    let filter = { idVinculacion };
    let vinculacionUpdate = {};
    const vinculacionSearch = await getVinculacionById(idVinculacion);

    if (vinculacionSearch && vinculacionSearch.idVinculacion) {
      //Si existe la vinculación
      const datosVinculacion = {
        empresaInstitucion: vinculacionData.empresaInstitucion,
        numeroMarco: vinculacionData.numeroMarco,
      };

      vinculacionUpdate = await update(
        "vinculaciones",
        filter,
        datosVinculacion
      );

      if (vinculacionUpdate) {
        if (vinculacionSearch.vinculacionesconfinanciamiento) {
          filter = { idConFinanciamiento: idVinculacion };

          const datosVinculacionFinanciamiento = {
            titulo: vinculacionData.conFinanciamiento?.titulo,
            nombreBeneficiario:
              vinculacionData.conFinanciamiento?.nombreBeneficiario,
            monto: vinculacionData.conFinanciamiento?.monto,
            cantidadDesembolsos:
              vinculacionData.conFinanciamiento?.cantidadDesembolsos,
            fechaPresentacion: convertToISOString(
              vinculacionData.conFinanciamiento?.fechaPresentacion
            ),
            fechaAdjudicacion: convertToISOString(
              vinculacionData.conFinanciamiento?.fechaAdjudicacion
            ),
            plazoEjecucion: vinculacionData.conFinanciamiento?.plazoEjecucion,
            estado: vinculacionData.conFinanciamiento?.estado,
            motivoEstado: vinculacionData.conFinanciamiento?.motivoEstado,
          };

          vinculacionUpdate.conFinanciamiento = await update(
            "vinculacionesconfinanciamiento",
            filter,
            datosVinculacionFinanciamiento
          );
        } else {
          filter = { idSinFinanciamiento: idVinculacion };

          const datosVinculacionSinFinanciamiento = {
            fechaInicio: convertToISOString(
              vinculacionData.sinFinanciamiento?.fechaInicio
            ),
            fechaCierre: convertToISOString(
              vinculacionData?.sinFinanciamiento?.fechaCierre
            ),
            descripcion: vinculacionData.sinFinanciamiento?.descripcion,
          };

          vinculacionUpdate.sinFinanciamiento = await update(
            "vinculacionessinfinanciamiento",
            filter,
            datosVinculacionSinFinanciamiento
          );
        }
      }
    }

    return vinculacionUpdate;
  } catch (error) {
    throw new Error(error.message);
  }
}
