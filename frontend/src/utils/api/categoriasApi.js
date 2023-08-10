import { get, post, put, del } from "./baseApi";


export async function createCategoria(data) {
  return post(`/api/categorias`, data);
}