import { get } from './baseApi';

export async function getAllTiposProyectos() {
  return get('/api/tiposProyectos');
}
