import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Search, RefreshCw } from 'lucide-react';
import { publicService } from '../../../services/publicService';

export default function AgenciasList() {
  const [agencias, setAgencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargarAgencias = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await publicService.getAgencias();
      setAgencias(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar agencias desde la base de datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAgencias();
  }, []);

  const agenciasFiltradas = agencias.filter((a) => {
    if (!busqueda.trim()) return true;
    const term = busqueda.toLowerCase();
    return (
      a.nombre.toLowerCase().includes(term) ||
      a.departamento.toLowerCase().includes(term) ||
      a.provincia.toLowerCase().includes(term) ||
      a.direccion.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Building size={24} className="text-primary" />
            <span>Directorio Nacional de Agencias</span>
          </h3>
          <p className="text-secondary small mb-0">
            Red oficial de sedes CargaExpress Perú conectadas a la base de datos ({agencias.length} agencias)
          </p>
        </div>

        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-1"
          onClick={cargarAgencias}
          title="Recargar"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Search size={18} className="text-muted" />
          </span>
          <input
            type="text"
            placeholder="Buscar por ciudad, departamento, nombre de sede o dirección..."
            className="form-control border-start-0"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {cargando ? (
        <div className="p-5 text-center text-muted">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <div>Cargando agencias desde el servidor...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center p-4">
          <p className="mb-2 fw-semibold">{error}</p>
          <button className="btn btn-sm btn-outline-danger" onClick={cargarAgencias}>
            Reintentar
          </button>
        </div>
      ) : agenciasFiltradas.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted">
          No se encontraron agencias que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="row g-3">
          {agenciasFiltradas.map((a) => (
            <div className="col-md-6 col-lg-4" key={a.id}>
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Building size={20} className="text-primary flex-shrink-0" />
                    <h6 className="fw-bold text-dark mb-0">{a.nombre}</h6>
                  </div>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small">
                    {a.departamento}
                  </span>
                </div>

                <div className="small text-secondary mb-2 d-flex align-items-start gap-1">
                  <MapPin size={16} className="flex-shrink-0 mt-1 text-muted" />
                  <span>
                    {a.direccion} ({a.provincia}, {a.distrito})
                  </span>
                </div>

                {a.telefono && (
                  <div className="small text-muted d-flex align-items-center gap-1 mt-auto pt-2 border-top">
                    <Phone size={14} />
                    <span>{a.telefono}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
