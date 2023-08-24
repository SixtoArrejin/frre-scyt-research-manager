import { get, post, put, del } from "./baseApi";


export async function createCategoria(data) {
  return post(`/api/categorias`, data);
}

export async function deleteCategoriaById(idCategoria) {
  return del(`/api/categorias/${idCategoria}`);
}