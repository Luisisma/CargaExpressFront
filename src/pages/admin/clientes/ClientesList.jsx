import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { clienteService } from '../../../services/clienteService';

export default function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargarClientes = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await clienteService.getClientes({ busqueda: busqueda.trim() });
      setClientes(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar clientes desde el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarClientes();
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Users size={24} className="text-primary" />
            <span>Directorio de Clientes</span>
          </h3>
          <p className="text-secondary small mb-0">Base consolidada de remitentes y destinatarios registrados en el sistema</p>
        </div>

        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-1"
          onClick={cargarClientes}
          title="Recargar"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <form onSubmit={handleBuscar} className="row g-2 mb-3">
          <div className="col-md-10">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                placeholder="Buscar por DNI, RUC, nombre o correo..."
                className="form-control border-start-0"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Buscar
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Nombre / Razón Social</th>
                <th>Contacto</th>
                <th>Tipo Cliente</th>
                <th>Envíos Registrados</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Cargando clientes desde la base de datos...
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No se encontraron clientes registrados.
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong className="font-monospace text-dark">{c.numero_documento}</strong>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{c.tipo_documento}</span>
                    </td>
                    <td className="fw-semibold text-dark">{c.nombre_completo}</td>
                    <td className="small text-muted">
                      {c.telefono && <div>Tel: {c.telefono}</div>}
                      {c.email && <div>{c.email}</div>}
                    </td>
                    <td>
                      <span className="small text-secondary text-capitalize">
                        {c.tipo_cliente.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                        {c.total_envios} {c.total_envios === 1 ? 'encomienda' : 'encomiendas'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
