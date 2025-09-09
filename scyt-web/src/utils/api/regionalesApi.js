import { get, post, put, del } from "./baseApi";

export async function getAllRegionales() {
  return get('/api/regionales')
}