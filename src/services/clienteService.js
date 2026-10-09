// ==============================================================================
// SERVICIO DE DIRECTORIO DE CLIENTES
// Backend: FastAPI (/api/v1/clientes)
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

export const clienteService = {
  /**
   * Listar clientes con búsqueda por DNI/RUC o nombres
   */
  async getClientes(params = {}) {
    const query = new URLSearchParams();
    if (params.busqueda) query.append('busqueda', params.busqueda);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request(`/clientes${queryString}`);
    return res.data;
  }
};
