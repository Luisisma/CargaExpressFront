// ==============================================================================
// SERVICIO DE GESTIÓN DE ENVÍOS Y ENCOMIENDAS
// Backend: FastAPI (/api/v1/envios)
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

export const envioService = {
  /**
   * Listar encomiendas con filtros opcionales (estado, búsqueda por tracking o remitente)
   */
  async getEnvios(params = {}) {
    const query = new URLSearchParams();
    if (params.estado) query.append('estado', params.estado);
    if (params.busqueda) query.append('busqueda', params.busqueda);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request(`/envios${queryString}`);
    return res.data;
  },

  /**
   * Obtener detalle completo de un envío por ID o tracking
   */
  async getEnvioDetalle(identificador) {
    const res = await request(`/envios/${identificador}`);
    return res.data;
  },

  /**
   * Recepcionar un envío físico en agencia (Cajero)
   */
  async recepcionarEnvio(identificador, payload) {
    const res = await request(`/envios/${encodeURIComponent(identificador)}/recepcionar`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Despachar envío (Almacén)
   */
  async despacharEnvio(identificador, notas = '') {
    const res = await request(`/envios/${encodeURIComponent(identificador)}/despachar`, {
      method: 'POST',
      body: JSON.stringify({ notas })
    });
    return res.data;
  },

  /**
   * Arribar envío (Destino)
   */
  async arribarEnvio(identificador, notas = '') {
    const res = await request(`/envios/${encodeURIComponent(identificador)}/arribar`, {
      method: 'POST',
      body: JSON.stringify({ notas })
    });
    return res.data;
  },

  /**
   * Entregar envío al cliente receptor con validación de DNI
   */
  async entregarEnvio(identificador, payload) {
    const res = await request(`/envios/${encodeURIComponent(identificador)}/entregar`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }
};
