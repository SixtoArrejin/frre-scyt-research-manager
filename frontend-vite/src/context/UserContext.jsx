import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")) : undefined);

  // Función para el inicio de sesión
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(userData));
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  // Función para el cierre de sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Función para verificar y manejar la expiración del token
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decodificar el token para obtener la fecha de expiración
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = exp * 1000; // Fecha de expiración en milisegundos

      if (Date.now() >= expirationTime) {
        // El token ha expirado, desloguear al usuario
        logout();
      }
    }
  };

  useEffect(() => {
    // Verificar y manejar la expiración del token cada minuto
    const interval = setInterval(checkTokenExpiration, 60000); // Verificar cada minuto

    // Verificar expiración al cargar la página
    checkTokenExpiration();

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
