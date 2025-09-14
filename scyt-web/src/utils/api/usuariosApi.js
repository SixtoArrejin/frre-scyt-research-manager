import { get, post, put, del } from './baseApi';

// Obtener todos los usuarios
export function getAllUsuarios() {
  return get('/api/usuarios');
}

// Crear un nuevo usuario
export function createUsuario(usuarioData) {
  return post('/api/usuarios', usuarioData);
}

// Actualizar un usuario existente
export function updateUsuario(usuario, usuarioData) {
  return put(`/api/usuarios/${usuario}`, usuarioData);
}

// Eliminar un usuario
export function deleteUsuario(usuario) {
  return del(`/api/usuarios/${usuario}`);
}

// Obtener roles disponibles
export function getRoles() {
  return get('/api/usuarios/roles');
}

// Obtener perfil del usuario actual
export function getProfile() {
  return get('/api/usuarios/profile');
}
