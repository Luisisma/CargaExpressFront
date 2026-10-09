import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { envioService } from '../../../services/envioService';

export default function EnviosList() {
  const [envios, setEnvios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargarEnvios = async () => {
    try {
      setCargando(true);
      setError('');
      const params = {};
      if (filtroEstado) params.estado = filtroEstado;
      if (busqueda.trim()) params.busqueda = busqueda.trim();
      
      const data = await envioService.getEnvios(params);
      setEnvios(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar las encomiendas desde el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEnvios();
  }, [filtroEstado]);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarEnvios();
  };

  const getBadgeClass = (estado) => {
    const e = (estado || '').toLowerCase();
    if (e.includes('entregado')) return 'badge bg-success';
    if (e.includes('transito')) return 'badge bg-info text-dark';
    if (e.includes('almacen')) return 'badge bg-warning text-dark';
    if (e.includes('registrado')) return 'badge bg-secondary';
    return 'badge bg-light text-dark border';
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Package className="text-primary" size={24} />
            <span>Gestión de Envíos y Encomiendas</span>
          </h3>
          <p className="text-secondary small mb-0">Control general de despachos y estado de órdenes en tiempo real</p>
        </div>

        <Link
          to="/registrar-pedido"
          className="btn btn-brand px-3 py-2 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
        >
          <span>+ Registrar Nuevo Envío</span>
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <form onSubmit={handleBuscar} className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                placeholder="Buscar por código de tracking, remitente o DNI..."
                className="form-control border-start-0"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los Estados</option>
              <option value="registrado">Registrado</option>
              <option value="en_almacen_origen">En Almacén Origen</option>
              <option value="en_transito">En Tránsito</option>
              <option value="en_almacen_destino">En Almacén Destino</option>
              <option value="en_reparto">En Reparto</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1">
              <Filter size={16} />
              <span>Filtrar</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={cargarEnvios}
              title="Recargar"
            >
              <RefreshCw size={16} />
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
                <th>Código Tracking</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Cargando encomiendas desde la base de datos...
                  </td>
                </tr>
              ) : envios.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    No se encontraron encomiendas con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                envios.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <code className="text-primary fw-bold" style={{ fontSize: '13px' }}>
                        {e.codigo_tracking}
                      </code>
                    </td>
                    <td className="small">{e.origen}</td>
                    <td className="small">{e.destino}</td>
                    <td className="small fw-semibold text-dark">{e.remitente}</td>
                    <td className="small text-secondary">{e.destinatario}</td>
                    <td>
                      <strong className="text-dark">S/ {e.total.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${e.estado_pago === 'pagado' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'} rounded-pill`}>
                        {e.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td>
                      <span className={`${getBadgeClass(e.estado)} rounded-pill px-2 py-1 small`}>
                        {e.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link
                        to={`/admin/envios/${e.id}`}
                        className="btn btn-sm btn-outline-primary rounded-3 d-inline-flex align-items-center gap-1 px-2 py-1"
                        title="Ver ficha técnica"
                      >
                        <Eye size={15} />
                        <span>Ver</span>
                      </Link>
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
