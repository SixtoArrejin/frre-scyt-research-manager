import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState( localStorage.getItem("token") ? true : false );
  const [currentUser, setCurrentUser] = useState( localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")) : undefined );

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

  // useEffect(() => {
  //   // Cuando el estado de isLoggedIn cambia a true, buscamos el nombre de usuario en el local storage
  //   if (isLoggedIn) {
  //     const user = localStorage.getItem("usuario");
  //     if (user) {
  //       const auser = JSON.parse(user);
  //       setCurrentUser(auser);
  //     }
  //   } else {
  //     setCurrentUser(null);
  //   }
  // }, [isLoggedIn]);

  useEffect(() => {
    // Verificar si existe un token en el almacenamiento local
    const token = localStorage.getItem("token");
    if (token) {
      // Si hay un token, el usuario está autenticado
      setIsLoggedIn(true);

      // Obtener el objeto de usuario desde el almacenamiento local
      const user = localStorage.getItem("usuario");
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
