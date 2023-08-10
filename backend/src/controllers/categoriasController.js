import { createCategoriaService } from '../services/categoriasService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { getByUsername } from '../repository/usuariosRepository.js';

export async function createCategoria(req, res) {
  try {
    const categoriaData = req.body;
    const newCategoria = await createCategoriaService(categoriaData);
    return res.status(201).json({ message: 'Categoria creada exitosamente', success: true, newCategoria });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}