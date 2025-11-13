import { get, post, put, del } from './baseApi';

export async function getPropiedadIntelectual() {
  return get(
    '/api/propiedadIntelectual',
  );
}

export async function getPropiedadIntelectualByIdProyecto(idProyecto) {
  return get(`/api/propiedadIntelectual/proyecto/${idProyecto}`);
}

export async function getPropiedadIntelectualById(idPI) {
  return get(`/api/propiedadIntelectual/${idPI}`);
}

export async function createPropiedadIntelectual(piData) {
  return post('/api/propiedadIntelectual', piData);
}

export async function updatePropiedadIntelectual(idPI, piData) {
  return put(`/api/propiedadIntelectual/${idPI}`, piData);
}

export async function deletePropiedadIntelectual(idPI) {
  return del(`/api/propiedadIntelectual/${idPI}`);
}
