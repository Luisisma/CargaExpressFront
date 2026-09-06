import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado simulado para navegar como Administrador por defecto
  const [user, setUser] = useState({
    id: 1,
    nombre: 'Administrador CargaExpress',
    email: 'admin@cargaexpress.pe',
    rol: 'administrador', // Opciones: 'administrador', 'cajero', 'almacen', 'courier'
    agencia: 'Agencia Principal Lima'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (dni, password) => {
    setIsAuthenticated(true);
    setUser({
      id: 1,
      nombre: 'Administrador CargaExpress',
      email: 'admin@cargaexpress.pe',
      rol: 'administrador',
      agencia: 'Agencia Principal Lima'
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser({ ...user, rol: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
