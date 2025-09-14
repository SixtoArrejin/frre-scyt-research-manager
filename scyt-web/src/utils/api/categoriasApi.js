import { get, post, put, del } from './baseApi';


export async function createCategoria(data) {
  return post('/api/categorias', data);
}

export async function deleteCategoriaById(idCategoria) {
  return del(`/api/categorias/${idCategoria}`);
}

export async function getCategoriaById(idCategoria) {
  return get(`/api/categorias/${idCategoria}`);
}

export async function putCategoriaById(idCategoria, data) {
  return put(`/api/categorias/${idCategoria}`, data);
}
