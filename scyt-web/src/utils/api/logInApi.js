import { get, post, put, del } from "./baseApi";

export async function logInUser(data) {
  return post(`/api/usuarios/login/`, data);
}