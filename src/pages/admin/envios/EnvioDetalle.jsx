import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Truck, User } from 'lucide-react';

export default function EnvioDetalle() {
  const { id } = useParams();

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/envios" className="btn btn-outline-secondary rounded-3 p-2">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h3 className="fw-bold text-dark mb-0">Detalle del Envío #{id || '1'}</h3>
          <span className="badge bg-info text-dark fw-bold">EN TRÁNSITO</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Información del Paquete</h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <span className="text-muted small">Tracking:</span>
                <h4 className="fw-bold text-brand-primary">CE2026070001</h4>
              </div>
              <div className="col-sm-6">
                <span className="text-muted small">Monto Cobrado:</span>
                <h4 className="fw-bold text-success">S/ 32.50</h4>
              </div>
              <div className="col-sm-6">
                <span className="text-muted small">Origen:</span>
                <p className="fw-semibold mb-0">Lima Principal (San Miguel)</p>
              </div>
              <div className="col-sm-6">
                <span className="text-muted small">Destino:</span>
                <p className="fw-semibold mb-0">Arequipa (Parque Industrial)</p>
              </div>
              <div className="col-sm-4">
                <span className="text-muted small">Peso Físico:</span>
                <p className="fw-semibold mb-0">4.5 kg</p>
              </div>
              <div className="col-sm-4">
                <span className="text-muted small">Peso Volumétrico:</span>
                <p className="fw-semibold mb-0">3.2 kg</p>
              </div>
              <div className="col-sm-4">
                <span className="text-muted small">Guía Remisión:</span>
                <p className="fw-semibold mb-0">GR-001-9821</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Intervinientes</h5>
            <div className="mb-3">
              <span className="text-muted small">Remitente:</span>
              <p className="fw-bold mb-0">Juan Pérez</p>
              <small className="text-secondary">DNI: 41238902 • Tel: 987654321</small>
            </div>
            <div>
              <span className="text-muted small">Destinatario:</span>
              <p className="fw-bold mb-0">Carlos Almonte</p>
              <small className="text-secondary">DNI: 10923847 • Tel: 912345678</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
