import { get, post, put, del } from "./baseApi";

// personasServices
export async function getProyectos(tipo) {
  return get(`/api/proyectos${ tipo ? ("?tipo="+tipo) : "" }`)
}