import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ce_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('ce_access_token') || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('ce_refresh_token') || null);
  const [tempToken, setTempToken] = useState(() => sessionStorage.getItem('ce_temp_token') || null);
  const [qrCode, setQrCode] = useState(() => sessionStorage.getItem('ce_2fa_qr') || null);
  const [secretManual, setSecretManual] = useState(() => sessionStorage.getItem('ce_2fa_secret') || null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('ce_access_token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sincronizar estado cuando cambian los tokens
  useEffect(() => {
    if (accessToken && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken, user]);

  /**
   * Guarda tokens y usuario en memoria y en localStorage
   */
  const guardarSesion = (tokens, usuario) => {
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    setUser(usuario);
    setIsAuthenticated(true);

    localStorage.setItem('ce_access_token', tokens.access_token);
    localStorage.setItem('ce_refresh_token', tokens.refresh_token);
    localStorage.setItem('ce_user', JSON.stringify(usuario));

    // Limpiar token temporal y QR de 2FA si existían
    setTempToken(null);
    setQrCode(null);
    setSecretManual(null);
    sessionStorage.removeItem('ce_temp_token');
    sessionStorage.removeItem('ce_2fa_qr');
    sessionStorage.removeItem('ce_2fa_secret');
  };

  /**
   * Paso 1: Login con DNI/Email y Password
   * Retorna objeto indicando si requiere 2FA
   */
  const login = async (identificador, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authService.login(identificador, password);
      const data = response.data;

      if (data.mfa_requerido) {
        setTempToken(data.temp_token);
        sessionStorage.setItem('ce_temp_token', data.temp_token);
        if (data.qr_code) {
          setQrCode(data.qr_code);
          sessionStorage.setItem('ce_2fa_qr', data.qr_code);
        }
        if (data.secret_manual) {
          setSecretManual(data.secret_manual);
          sessionStorage.setItem('ce_2fa_secret', data.secret_manual);
        }
        return { mfa_requerido: true };
      }

      // Si no requiere 2FA, sesión lista
      guardarSesion(
        { access_token: data.access_token, refresh_token: data.refresh_token },
        data.usuario
      );
      return { mfa_requerido: false };
    } catch (err) {
      setAuthError(err.message || 'Error al iniciar sesión.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Paso 2: Verificación de código TOTP
   */
  const verify2FA = async (codigoTotp) => {
    if (!tempToken) {
      throw new Error('La sesión temporal de verificación ha expirado. Inicia sesión nuevamente.');
    }

    setLoading(true);
    setAuthError(null);
    try {
      const response = await authService.verify2FA(tempToken, codigoTotp);
      const data = response.data;

      guardarSesion(
        { access_token: data.access_token, refresh_token: data.refresh_token },
        data.usuario
      );
      return data;
    } catch (err) {
      setAuthError(err.message || 'Código de verificación 2FA incorrecto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierre de sesión y revocación en servidor
   */
  const logout = async () => {
    if (accessToken) {
      try {
        await authService.logout(accessToken);
      } catch (err) {
        console.warn('Error revocando sesión en servidor:', err.message);
      }
    }

    // Limpieza local inmediata
    setAccessToken(null);
    setRefreshToken(null);
    setTempToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    localStorage.removeItem('ce_access_token');
    localStorage.removeItem('ce_refresh_token');
    localStorage.removeItem('ce_user');
    sessionStorage.removeItem('ce_temp_token');
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, tipo: newRole, rol: newRole };
      setUser(updated);
      localStorage.setItem('ce_user', JSON.stringify(updated));
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        tempToken,
        qrCode,
        secretManual,
        isAuthenticated,
        loading,
        authError,
        login,
        verify2FA,
        logout,
        switchRole,
        clearError
      }}
    >
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
