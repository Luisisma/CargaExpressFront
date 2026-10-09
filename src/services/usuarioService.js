// ==============================================================================
// SERVICIO DE GESTIÓN DE USUARIOS Y PERSONAL (RBAC)
// Backend: FastAPI (http://localhost:8000/api/v1/usuarios)
// ==============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('ce_access_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
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
    const errorMessage = data?.error?.message || data?.detail || 'Error en la solicitud.';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const usuarioService = {
  /**
   * Listar todos los colaboradores (permite filtros opcionales)
   */
  async getUsuarios(params = {}) {
    const query = new URLSearchParams();
    if (params.rol) query.append('rol', params.rol);
    if (params.agencia_id) query.append('agencia_id', params.agencia_id);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await request(`/usuarios${queryString}`);
    return res.data;
  },

  /**
   * Crear nuevo colaborador
   */
  async crearUsuario(usuarioData) {
    const res = await request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuarioData)
    });
    return res.data;
  },

  /**
   * Obtener detalle de un colaborador por ID
   */
  async getUsuario(id) {
    const res = await request(`/usuarios/${id}`);
    return res.data;
  },

  /**
   * Actualizar datos del colaborador
   */
  async actualizarUsuario(id, usuarioData) {
    const res = await request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioData)
    });
    return res.data;
  },

  /**
   * Activar / Desactivar acceso del colaborador
   */
  async toggleActivo(id) {
    const res = await request(`/usuarios/${id}/toggle-activo`, {
      method: 'PATCH'
    });
    return res.data;
  },

  /**
   * Activar o desactivar autenticación 2FA/MFA para un colaborador
   */
  async toggle2FA(id) {
    const res = await request(`/usuarios/${id}/toggle-2fa`, {
      method: 'PATCH'
    });
    return res.data;
  }
};

