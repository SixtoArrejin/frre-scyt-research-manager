import { get, post, put, del } from "./baseApi";

// personasServices
export async function getAllPersonas() {
    return get('/api/personas')
  }
  
  export async function createPersona(id, data) {
    return post(`/api/personas/${id}`, data);
  }
  
  export async function updatePersona(id, data) {
    return put(`/api/personas/${id}`, data);
  }
  
  export async function deletePersona(id) {
    return del(`/api/personas/${id}`);
  }