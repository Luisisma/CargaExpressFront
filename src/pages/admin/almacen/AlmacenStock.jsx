import React from 'react';
import { Warehouse } from 'lucide-react';

export default function AlmacenStock() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Almacén y Custodia</h3>
          <p className="text-secondary small mb-0">Inventario físico de paquetes en tránsito y custodia de agencia</p>
        </div>
      </div>
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <p className="text-muted mb-0">Total de 68 bultos registrados actualmente en el almacén local.</p>
      </div>
    </div>
  );
}
