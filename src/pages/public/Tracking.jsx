import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, CheckCircle2, Clock, Truck, Check } from 'lucide-react';

export default function Tracking() {
  const { codigo } = useParams();
  const [inputCode, setInputCode] = useState(codigo || '');
  const [searched, setSearched] = useState(!!codigo);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Rastreo de Envíos en Tiempo Real</h2>
            <p className="text-secondary small">Ingresa el código de 12 caracteres (Ej: CE2026070001)</p>
          </div>

          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              placeholder="Código de Tracking..."
              className="form-control form-control-lg rounded-3 text-uppercase fw-bold"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button type="submit" className="btn btn-brand btn-lg px-4 rounded-3 fw-bold d-flex align-items-center gap-2">
              <Search size={20} />
              <span>Buscar</span>
            </button>
          </form>
        </div>

        {searched && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <div>
                <span className="small text-muted">Envío</span>
                <h4 className="fw-bold text-brand-primary mb-0">{inputCode || 'CE2026070001'}</h4>
              </div>
              <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold">EN TRÁNSITO</span>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <span className="text-muted small">Origen:</span>
                <p className="fw-bold mb-0">Lima (Sede Principal Central)</p>
              </div>
              <div className="col-sm-6">
                <span className="text-muted small">Destino:</span>
                <p className="fw-bold mb-0">Arequipa (Agencia Parque Industrial)</p>
              </div>
            </div>

            {/* Timeline */}
            <h6 className="fw-bold text-dark mb-3">Historial de Eventos</h6>
            <div className="list-group list-group-flush border-start border-2 border-primary ms-3">
              <div className="list-group-item bg-transparent border-0 ps-3 position-relative pb-4">
                <span className="badge bg-success rounded-circle p-1 position-absolute top-0 start-0 translate-middle">
                  <Check size={12} className="text-white" />
                </span>
                <strong className="d-block text-dark">En Tránsito hacia Destino</strong>
                <small className="text-muted">Hoy, 14:30 hrs • Manifiesto MAN-2026-0041 asignado al camión V8Z-902</small>
              </div>
              <div className="list-group-item bg-transparent border-0 ps-3 position-relative pb-4">
                <span className="badge bg-success rounded-circle p-1 position-absolute top-0 start-0 translate-middle">
                  <Check size={12} className="text-white" />
                </span>
                <strong className="d-block text-dark">Recepción en Almacén Lima</strong>
                <small className="text-muted">Ayer, 18:20 hrs • Paquete pesado (6.5 kg) y precintado</small>
              </div>
              <div className="list-group-item bg-transparent border-0 ps-3 position-relative">
                <span className="badge bg-success rounded-circle p-1 position-absolute top-0 start-0 translate-middle">
                  <Check size={12} className="text-white" />
                </span>
                <strong className="d-block text-dark">Registrado en Ventanilla</strong>
                <small className="text-muted">Ayer, 16:05 hrs • Guía de Remisión GR-001-9821</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
