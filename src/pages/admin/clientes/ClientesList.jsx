import React from 'react';
import { Users, Search } from 'lucide-react';

export default function ClientesList() {
  const clientes = [
    { id: 1, doc: '41238902', nombre: 'Juan Pérez Ramos', tipo: 'DNI', envios: 12 },
    { id: 2, doc: '20601234567', nombre: 'Comercializadora del Sur S.A.C.', tipo: 'RUC', envios: 85 },
    { id: 3, doc: '70891234', nombre: 'María Gómez Flores', tipo: 'DNI', envios: 5 },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Directorio de Clientes</h3>
          <p className="text-secondary small mb-0">Base consolidada de remitentes y destinatarios</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Nombre / Razón Social</th>
                <th>Envíos Registrados</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.doc}</strong></td>
                  <td><span className="badge bg-light text-dark border">{c.tipo}</span></td>
                  <td>{c.nombre}</td>
                  <td><span className="badge bg-primary-subtle text-brand-primary">{c.envios} órdenes</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
