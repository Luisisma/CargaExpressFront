// ==============================================================================
// SERVICIO PÚBLICO: Agencias, Cotizador, Tracking y Registro de Envíos
// Backend: FastAPI (http://localhost:8000/api/v1/publico)
// Base de Datos: cargaexpress_clean.sql
// ==============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
    const errorMessage = data?.error?.message || data?.detail || 'Error en la solicitud.';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const publicService = {
  /**
   * Obtiene la lista de agencias operativas habilitadas
   */
  async getAgencias() {
    const res = await request('/publico/agencias');
    return res.data;
  },

  /**
   * Calcula la cotización oficial en el backend
   */
  async cotizar(datos) {
    const res = await request('/publico/cotizar', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    return res.data;
  },

  /**
   * Rastrear un envío por código (ej: CE-2026-00001)
   */
  async getTracking(codigo) {
    const res = await request(`/publico/tracking/${encodeURIComponent(codigo)}`);
    return res.data;
  },

  /**
   * Buscar cliente recurrente por DNI/RUC
   */
  async buscarCliente(documento) {
    const res = await request(`/publico/buscar-cliente/${encodeURIComponent(documento)}`);
    return res.data;
  },

  /**
   * Registrar una encomienda desde el portal público
   */
  async registrarPedido(datos) {
    const res = await request('/publico/pedidos/registrar', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    return res.data;
  },

  /**
   * Cancelar un pre-registro web no pagado
   */
  async cancelarPedido(codigo, documentoRemitente) {
    const res = await request(`/publico/pedidos/${encodeURIComponent(codigo)}/cancelar`, {
      method: 'POST',
      body: JSON.stringify({
        numero_documento_remitente: documentoRemitente,
        motivo: "Cancelación solicitada por el cliente mediante el portal web."
      })
    });
    return res.data;
  }
};
