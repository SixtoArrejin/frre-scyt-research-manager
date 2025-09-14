import { createContext, useEffect, useState, useCallback } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('token') ? true : false,
  );
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('usuario')
      ? JSON.parse(localStorage.getItem('usuario'))
      : undefined,
  );

  // Función para el inicio de sesión
  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(userData));
    setIsLoggedIn(true);
    setCurrentUser(userData);
  }, []);

  // Función para el cierre de sesión
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  // Función para verificar y manejar la expiración del token
  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= exp * 1000) {
        logout();
      }
    } catch (err) {
      console.error('Error al decodificar token:', err);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // Verificar expiración al cargar la página
    checkTokenExpiration();

    // Verificar expiración cada minuto
    const interval = setInterval(checkTokenExpiration, 60000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  // Extra: manejar logout si el token cambia desde otra pestaña
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
