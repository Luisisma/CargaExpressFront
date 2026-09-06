import React from 'react';
import { Package, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EnviosList() {
  const envios = [
    { id: 1, tracking: 'CE2026070001', origen: 'Lima Principal', destino: 'Arequipa Industrial', remitente: 'Juan Pérez', estado: 'EN TRÁNSITO', total: 'S/ 32.50' },
    { id: 2, tracking: 'CE2026070002', origen: 'Lima Principal', destino: 'Trujillo Centro', remitente: 'María Gómez', estado: 'EN ALMACÉN', total: 'S/ 68.00' },
    { id: 3, tracking: 'CE2026070003', origen: 'Lima Principal', destino: 'Chiclayo Terminal', remitente: 'Carlos Ramos', estado: 'ENTREGADO', total: 'S/ 22.00' },
    { id: 4, tracking: 'CE2026070004', origen: 'Lima Principal', destino: 'Cusco Terrestre', remitente: 'Sofía Vargas', estado: 'REGISTRADO', total: 'S/ 45.00' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Gestión de Envíos y Encomiendas</h3>
          <p className="text-secondary small mb-0">Control general de despachos y estado de órdenes</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light"><Search size={18} /></span>
              <input type="text" placeholder="Buscar por código de tracking o remitente..." className="form-control" />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option value="">Todos los Estados</option>
              <option value="REGISTRADO">Registrado</option>
              <option value="EN ALMACEN">En Almacén</option>
              <option value="EN TRANSITO">En Tránsito</option>
              <option value="ENTREGADO">Entregado</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
              <Filter size={18} />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Código Tracking</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Remitente</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {envios.map((e) => (
                <tr key={e.id}>
                  <td><strong className="text-brand-primary">{e.tracking}</strong></td>
                  <td>{e.origen}</td>
                  <td>{e.destino}</td>
                  <td>{e.remitente}</td>
                  <td><strong>{e.total}</strong></td>
                  <td>
                    <span className={`badge ${
                      e.estado === 'ENTREGADO' ? 'bg-success' :
                      e.estado === 'EN TRÁNSITO' ? 'bg-info text-dark' :
                      e.estado === 'EN ALMACÉN' ? 'bg-warning text-dark' : 'bg-secondary'
                    }`}>
                      {e.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link to={`/admin/envios/${e.id}`} className="btn btn-sm btn-outline-primary rounded-3 d-inline-flex align-items-center gap-1">
                      <Eye size={16} />
                      <span>Ver</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
