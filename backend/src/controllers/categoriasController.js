import { createCategoriaService, getCategoriaByIdService, deleteCategoriaService } from '../services/categoriasService.js';
import { getById } from '../repository/baseRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { getByUsername } from '../repository/usuariosRepository.js';
import convertToISOString from '../utils/funciones.js'

export async function createCategoria(req, res) {
  try {
    const categoriaData = req.body;
    // categoriaData.equiparacion = categoriaData.equiparacion === 'true';
    categoriaData.fecha = convertToISOString(categoriaData.fecha);
    console.log(typeof(categoriaData.fecha))
    const newCategoria = await createCategoriaService(categoriaData);
    return res.status(201).json({ message: 'Categoria creada exitosamente', success: true, newCategoria });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getCategoriaById(req, res) {
  try {
    const {idCategoria} = req.params;
    const categoriaId = parseInt(idCategoria);
    const categoria = await getCategoriaByIdService(categoriaId);
    return res.status(200).json({ message: 'Categoria encontrada', success: true, categoria });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function deleteCategoria(req, res) {
  try {
    const idCategoria = parseInt(req.params.idCategoria, 10);
    const categoria = await getById('categorias', 'idCategoria', idCategoria);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada', success: false });
    }

    await deleteCategoriaService(idCategoria);

    return res.status(200).json({ message: 'Categoría eliminada exitosamente', success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}