import { get, post, put, del } from "./baseApi";

export async function getAllTiposProyectos() {
  return get('/api/tiposProyectos')
}