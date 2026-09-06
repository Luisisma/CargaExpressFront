import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, QrCode, ArrowLeft, Printer } from 'lucide-react';

export default function PedidoExitoso() {
  const { tracking } = useParams();

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 bg-white">
          <div className="text-success mb-3">
            <CheckCircle size={64} className="mx-auto" />
          </div>
          <h2 className="fw-bold text-dark">¡Orden Registrada con Éxito!</h2>
          <p className="text-secondary">
            Presenta este código o código QR en cualquier ventanilla de CargaExpress para formalizar el despacho.
          </p>

          <div className="p-4 bg-light rounded-4 border my-4">
            <div className="small text-muted mb-1">CÓDIGO DE TRACKING GENERADO</div>
            <div className="display-6 fw-bold text-brand-primary">{tracking || 'CE9482710382'}</div>
            <div className="my-3 text-secondary">
              <QrCode size={120} className="mx-auto text-dark" />
            </div>
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
              Estado: REGISTRADO (Pendiente entrega en ventanilla)
            </span>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2">
              <ArrowLeft size={18} />
              <span>Volver al Inicio</span>
            </Link>
            <Link to={`/tracking/${tracking}`} className="btn btn-brand px-4 py-2 rounded-3 fw-semibold">
              Ver Seguimiento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
