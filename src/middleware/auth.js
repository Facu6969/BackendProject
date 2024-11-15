import { verifyToken } from '../utils/jsonwebtoken.js';

export const requireAuth = (req, res, next) => {
  if (req.path === '/login' || req.path === '/register' || req.path.startsWith("/api/sessions")) {
    return next();
  }

  const token = req.cookies.token;
  console.log('Token recibido:', token);

  if (!token) {
    return res.redirect('/login');
  }

  const user = verifyToken(token);

  if (!user) {
    return res.redirect('/login');
  }

  req.user = user;
  next();
};

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token; // Leer el token desde las cookies
    console.log('Token recibido:', token);

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó ningún token' });
    }

    const user = verifyToken(token); // Verificar el token

    console.log('Usuario autenticado:', user);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Aquí agregamos el console.log para ver el rol del usuario
    console.log(`Usuario autenticado: ${user.email}, Rol: ${user.role}`);

    // Verificar si el usuario tiene uno de los roles permitidos
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Acceso denegado: No tienes permisos suficientes' });
    }

    req.user = user; // Guardar los datos del usuario en la request
    next(); // Continuar con la siguiente función en la ruta
  };
};

export default authMiddleware;
