import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Función para el inicio de sesión
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  // Función para el cierre de sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Cuando el estado de isLoggedIn cambia a true, buscamos el nombre de usuario en el local storage
    if (isLoggedIn) {
      const user = localStorage.getItem("usuario");
      if (user) {
        const auser = JSON.parse(user);
        setCurrentUser(auser);
      }
    } else {
      setCurrentUser(null);
    }
  }, [isLoggedIn]);

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
