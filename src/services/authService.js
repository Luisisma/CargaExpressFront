// ==============================================================================
// SERVICIO DE AUTENTICACIÓN Y CONSUMO DE API REST
// Proyecto: CargaExpress Perú
// Backend: FastAPI (http://localhost:8000/api/v1)
// ==============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Realiza una petición HTTP genérica controlando respuestas en formato Envelope
 * y excepciones estandarizadas de FastAPI.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Respuesta inválida del servidor.');
  }

  if (!response.ok) {
    // Si la respuesta es de error Envelope {"success": false, "error": {"message": ...}}
    const errorMessage = data?.error?.message || data?.detail || 'Error en la solicitud.';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const authService = {
  /**
   * Paso 1: Iniciar sesión con DNI/Email y Contraseña
   * @param {string} identificador - DNI de 8 dígitos o correo
   * @param {string} password - Contraseña
   * @returns {Promise<{success: boolean, data: {mfa_requerido: boolean, temp_token?: string, access_token?: string, refresh_token?: string, usuario?: object}}>}
   */
  async login(identificador, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identificador, password })
    });
  },

  /**
   * Paso 2: Verificar código TOTP (Google Authenticator) con token temporal
   * @param {string} tempToken - Token temporal de 5 minutos
   * @param {string} codigoTotp - Código numérico de 6 dígitos
   */
  async verify2FA(tempToken, codigoTotp) {
    return request('/auth/2fa', {
      method: 'POST',
      body: JSON.stringify({
        temp_token: tempToken,
        codigo_totp: codigoTotp
      })
    });
  },

  /**
   * Obtener el perfil del usuario autenticado (requiere Bearer token)
   * @param {string} accessToken
   */
  async getProfile(accessToken) {
    return request('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },

  /**
   * Renovar sesión con Refresh Token
   * @param {string} refreshToken
   */
  async refreshToken(refreshToken) {
    return request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  },

  /**
   * Cierre de sesión seguro y revocación global en base de datos
   * @param {string} accessToken
   */
  async logout(accessToken) {
    return request('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },

  /**
   * Solicitar recuperación de contraseña por DNI o correo
   * @param {string} identificador - DNI o Correo
   */
  async solicitarRecuperacionPassword(identificador) {
    return request('/auth/recuperar-password', {
      method: 'POST',
      body: JSON.stringify({ identificador })
    });
  },

  /**
   * Restablecer contraseña utilizando el token firmado
   * @param {object} payload - { token, nueva_password, codigo_totp }
   */
  async restablecerPassword({ token, nueva_password, codigo_totp }) {
    return request('/auth/restablecer-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        nueva_password,
        codigo_totp: codigo_totp || null
      })
    });
  }
};
