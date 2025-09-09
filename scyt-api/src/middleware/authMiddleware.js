import jwt from 'jsonwebtoken';

// Middleware para proteger las rutas con token
export function validateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado', success: false });
  }

  try {
    const decodedToken = jwt.verify(token, 'secreto'); //Establecer una clave mas seguro que "secreto" y colocarlo en variables de entorno
    req.userData = { usuario: decodedToken.usuario };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido', success: false });
  }
}
