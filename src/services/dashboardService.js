// ==============================================================================
// SERVICIO DE DASHBOARD Y KPIS OPERATIVOS
// Backend: FastAPI (/api/v1/dashboard/resumen)
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

export const dashboardService = {
  /**
   * Obtiene resumen ejecutivo con KPIs reales y últimos despachos
   */
  async getResumen() {
    const res = await request('/dashboard/resumen');
    return res.data;
  }
};
