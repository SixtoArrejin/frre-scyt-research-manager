export function formatoFechaISOaDDMMAAAA(fechaISO) {
  const fechaObjeto = new Date(fechaISO);
  const dia = String(fechaObjeto.getDate()).padStart(2, "0");
  const mes = String(fechaObjeto.getMonth() + 1).padStart(2, "0");
  const año = fechaObjeto.getFullYear();
  return `${dia}/${mes}/${año}`;
}