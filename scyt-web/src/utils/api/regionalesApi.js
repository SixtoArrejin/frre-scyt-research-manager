import { get } from './baseApi';

export async function getAllRegionales() {
  return get('/api/regionales');
}
