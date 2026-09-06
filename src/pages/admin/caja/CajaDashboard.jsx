import React from 'react';
import { DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function CajaDashboard() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Gestión de Caja</h3>
          <p className="text-secondary small mb-0">Control de apertura, movimientos en efectivo/digital y arqueo</p>
        </div>
        <button className="btn btn-brand rounded-3 fw-semibold">Arqueo de Caja</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="text-secondary small fw-semibold">Saldo Inicial</span>
            <h3 className="fw-bold text-dark my-1">S/ 350.00</h3>
            <span className="small text-muted">Apertura: Hoy 08:00 AM</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="text-secondary small fw-semibold">Ingresos por Envíos</span>
            <h3 className="fw-bold text-success my-1">S/ 5,070.00</h3>
            <span className="small text-muted">Total de 48 cobros</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="text-secondary small fw-semibold">Saldo Total en Caja</span>
            <h3 className="fw-bold text-brand-primary my-1">S/ 5,420.00</h3>
            <span className="small text-muted">Efectivo + Yape/Plin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
