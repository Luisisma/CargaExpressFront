import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle2 } from 'lucide-react';

export default function RegistrarPedido() {
  const navigate = useNavigate();
  const [remitente, setRemitente] = useState({ dni: '', nombre: '', telefono: '' });
  const [destinatario, setDestinatario] = useState({ dni: '', nombre: '', telefono: '', direccion: '' });
  const [contenido, setContenido] = useState('Documentos / Enseres personales');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockTracking = 'CE' + Math.floor(1000000000 + Math.random() * 9000000000);
    navigate(`/pedido-exitoso/${mockTracking}`);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-brand-primary text-white p-3 rounded-3">
              <Package size={28} />
            </div>
            <div>
              <h2 className="fw-bold text-dark mb-0">Registrar Nuevo Envío</h2>
              <p className="text-secondary small mb-0">Genera tu orden pública para entregar rápidamente en ventanilla.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Remitente */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">1. Datos del Remitente</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">DNI Remitente</label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  placeholder="8 dígitos"
                  className="form-control rounded-3"
                  value={remitente.dni}
                  onChange={(e) => setRemitente({ ...remitente, dni: e.target.value })}
                />
              </div>
              <div className="col-md-5">
                <label className="form-label small fw-bold text-secondary">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nombres y Apellidos"
                  className="form-control rounded-3"
                  value={remitente.nombre}
                  onChange={(e) => setRemitente({ ...remitente, nombre: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Teléfono Móvil</label>
                <input
                  type="tel"
                  required
                  placeholder="9 dígitos"
                  className="form-control rounded-3"
                  value={remitente.telefono}
                  onChange={(e) => setRemitente({ ...remitente, telefono: e.target.value })}
                />
              </div>
            </div>

            {/* Destinatario */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">2. Datos del Destinatario</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">DNI Destinatario</label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  placeholder="8 dígitos"
                  className="form-control rounded-3"
                  value={destinatario.dni}
                  onChange={(e) => setDestinatario({ ...destinatario, dni: e.target.value })}
                />
              </div>
              <div className="col-md-5">
                <label className="form-label small fw-bold text-secondary">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nombres y Apellidos"
                  className="form-control rounded-3"
                  value={destinatario.nombre}
                  onChange={(e) => setDestinatario({ ...destinatario, nombre: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Teléfono Destinatario</label>
                <input
                  type="tel"
                  required
                  placeholder="9 dígitos"
                  className="form-control rounded-3"
                  value={destinatario.telefono}
                  onChange={(e) => setDestinatario({ ...destinatario, telefono: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold text-secondary">Dirección / Entrega en Agencia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Entrega en Agencia Arequipa Centro o Dirección exacta"
                  className="form-control rounded-3"
                  value={destinatario.direccion}
                  onChange={(e) => setDestinatario({ ...destinatario, direccion: e.target.value })}
                />
              </div>
            </div>

            {/* Contenido */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">3. Detalle del Paquete</h5>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <label className="form-label small fw-bold text-secondary">Descripción del Contenido</label>
                <input
                  type="text"
                  required
                  className="form-control rounded-3"
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-brand btn-lg w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2">
              <CheckCircle2 size={20} />
              <span>Confirmar y Generar Orden de Envío</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
