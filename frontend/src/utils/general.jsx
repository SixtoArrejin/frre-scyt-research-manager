export function formatoFechaISOaDDMMAAAA(fechaISO) {
  const fechaObjeto = new Date(fechaISO);
  const dia = String(fechaObjeto.getUTCDate()).padStart(2, "0");
  const mes = String(fechaObjeto.getUTCMonth() + 1).padStart(2, "0");
  const año = fechaObjeto.getUTCFullYear();
  return `${dia}/${mes}/${año}`;
}