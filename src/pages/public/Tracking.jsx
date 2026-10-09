import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, Clock, Truck, Check, AlertCircle, ArrowRight, Box, CreditCard, XCircle, Info } from 'lucide-react';
import { publicService } from '../../services/publicService';
import ModalPagoYape from '../../components/ModalPagoYape';

export default function Tracking() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState(codigo || '');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [envio, setEnvio] = useState(null);
  const [showPago, setShowPago] = useState(false);
  
  // Estado para cancelación
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [docRemitente, setDocRemitente] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Ejecutar búsqueda si hay código en la URL
  useEffect(() => {
    if (codigo) {
      setInputCode(codigo.toUpperCase());
      consultarTracking(codigo.toUpperCase());
    } else {
      setEnvio(null);
      setError('');
    }
  }, [codigo]);

  const consultarTracking = async (cod) => {
    const codLimpio = cod.trim().toUpperCase();
    if (!codLimpio) return;

    try {
      setCargando(true);
      setError('');
      setCancelError('');
      const data = await publicService.getTracking(codLimpio);
      setEnvio(data);
    } catch (err) {
      setEnvio(null);
      setError(err.message || `No se encontró información para el código de tracking "${codLimpio}".`);
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = async () => {
    if (!docRemitente.trim()) {
      setCancelError("Debes ingresar tu DNI/RUC para verificar tu identidad.");
      return;
    }
    
    try {
      setCancelLoading(true);
      setCancelError('');
      await publicService.cancelarPedido(envio.codigo_tracking, docRemitente);
      
      setShowCancelModal(false);
      setDocRemitente('');
      // Refrescar tracking
      consultarTracking(envio.codigo_tracking);
    } catch (err) {
      setCancelError(err.message || "Error al intentar cancelar el pedido.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/tracking/${inputCode.trim().toUpperCase()}`);
    }
  };

  // Formato legible para fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    try {
      const d = new Date(fechaStr);
      return d.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="row justify-content-center py-2 py-md-4">
      <div className="col-lg-8">
        {/* Caja de Búsqueda */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-1">Rastreo de Envíos en Tiempo Real</h2>
            <p className="text-secondary small">
              Ingresa el código correlativo oficial de tu encomienda (Ej: CE-2026-00001)
            </p>
          </div>

          <form onSubmit={handleSearch} className="d-flex flex-column flex-sm-row gap-2">
            <div className="position-relative flex-grow-1">
              <input
                type="text"
                placeholder="CE-2026-XXXXX"
                className="form-control form-control-lg rounded-3 text-uppercase fw-bold"
                style={{ letterSpacing: '1px' }}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              />
            </div>
            <button
              type="submit"
              className="btn btn-brand btn-lg px-4 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={cargando}
            >
              {cargando ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <Search size={20} />
              )}
              <span>Buscar</span>
            </button>
          </form>
        </div>

        {/* Error o no encontrado */}
        {error && (
          <div className="alert alert-warning rounded-4 shadow-sm p-4 d-flex align-items-start gap-3 mb-4">
            <AlertCircle size={24} className="text-warning flex-shrink-0 mt-1" />
            <div>
              <h6 className="fw-bold text-dark mb-1">Código no encontrado</h6>
              <p className="mb-0 text-secondary small">{error}</p>
              <small className="text-muted d-block mt-2">
                Verifica que el código esté escrito correctamente incluyendo los guiones (Ejemplo: CE-2026-00002).
              </small>
            </div>
          </div>
        )}

        {/* Información del Envío encontrado */}
        {envio && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4 gap-2">
              <div>
                <span className="small text-muted fw-bold text-uppercase">CÓDIGO DE SEGUIMIENTO</span>
                <h3 className="fw-bold text-brand-primary mb-0 font-monospace">{envio.codigo_tracking}</h3>
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold fs-6">
                  {envio.estado}
                </span>
                <span className={`badge ${envio.estado_pago === 'pagado' ? 'bg-success' : 'bg-warning text-dark'} px-2 py-1 rounded-pill small`}>
                  Pago: {envio.estado_pago.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Datos generales protegidos (OWASP API1 / PII) */}
            <div className="row g-3 mb-4 bg-light p-3 rounded-4 border">
              <div className="col-sm-6">
                <span className="text-muted small d-block">Origen (Agencia Emisora):</span>
                <p className="fw-bold text-dark mb-0">{envio.origen}</p>
                <small className="text-secondary">Remitente: {envio.remitente}</small>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small d-block">Destino (Agencia Receptora):</span>
                <p className="fw-bold text-dark mb-0">{envio.destino}</p>
                <small className="text-secondary">Destinatario: {envio.destinatario}</small>
              </div>

              <div className="col-sm-6 mt-2 pt-2 border-top">
                <span className="text-muted small d-block">Tipo de Encomienda:</span>
                <span className="fw-semibold text-dark text-capitalize">
                  {envio.tipo_paquete} ({envio.tipo_envio.replace('_', ' a ')})
                </span>
              </div>

              <div className="col-sm-6 mt-2 pt-2 border-top">
                <span className="text-muted small d-block">Registrado el:</span>
                <span className="fw-semibold text-dark">{formatearFecha(envio.creado_en)}</span>
              </div>
            </div>

            {/* Línea de tiempo de hitos histórica */}
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-primary" />
              <span>Historial de Eventos del Envío</span>
            </h6>

            {envio.historial && envio.historial.length > 0 ? (
              <div className="list-group list-group-flush border-start border-3 border-primary ms-3 ps-2">
                {envio.historial.map((hito, idx) => (
                  <div key={idx} className="list-group-item bg-transparent border-0 ps-3 position-relative pb-4">
                    <span className="badge bg-primary rounded-circle p-1 position-absolute top-0 start-0 translate-middle">
                      <Check size={12} className="text-white" />
                    </span>
                    <strong className="d-block text-dark fs-6">{hito.estado}</strong>
                    <p className="text-secondary small mb-1">{hito.descripcion}</p>
                    <div className="small text-muted d-flex align-items-center gap-2">
                      <span><i className="bi bi-geo-alt"></i> {hito.ubicacion}</span>
                      <span>•</span>
                      <span>{formatearFecha(hito.fecha)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-muted small bg-light rounded-3">
                No hay hitos adicionales registrados para esta encomienda.
              </div>
            )}

            {/* Opcion de pago en linea y politicas */}
            {envio.estado.toLowerCase() === 'registrado' && envio.estado_pago === 'pendiente' && (
              <div className="mt-4 pt-3 border-top">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-4 border h-100 text-center d-flex flex-column justify-content-center">
                      <p className="mb-2 fw-semibold text-dark">¿Aún no has pagado tu envío?</p>
                      <button 
                        className="btn btn-warning rounded-pill fw-bold text-dark d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                        onClick={() => setShowPago(true)}
                      >
                        <CreditCard size={18} />
                        Pagar Ahora (S/ {Number(envio.precio_total).toFixed(2)})
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-white rounded-4 border border-danger h-100 text-center d-flex flex-column justify-content-center">
                      <p className="mb-2 fw-semibold text-danger">¿Deseas cancelar el envío?</p>
                      <button 
                        className="btn btn-outline-danger rounded-pill fw-bold d-inline-flex align-items-center justify-content-center gap-2"
                        onClick={() => setShowCancelModal(true)}
                      >
                        <XCircle size={18} />
                        Anular Pre-registro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Aviso de Políticas */}
            <div className="mt-4 alert alert-info rounded-4 border-0 shadow-sm d-flex gap-3 mb-0">
              <Info size={24} className="text-info flex-shrink-0 mt-1" />
              <div className="small">
                <strong>Políticas de Cancelación (Resumen):</strong>
                <ul className="mb-0 ps-3 mt-1 text-secondary">
                  <li>Tienes <strong>48 horas hábiles</strong> para despachar o pagar tu pre-registro, de lo contrario expirará automáticamente.</li>
                  <li>Puedes anular el pre-registro libremente desde este portal <strong>si no has pagado</strong>.</li>
                  <li>Si ya realizaste el pago y deseas cancelar (antes del despacho), el trámite debe hacerse <strong>presencialmente en agencia</strong> y puede aplicar una retención de hasta 10% por gastos operativos.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Cancelación */}
      {showCancelModal && envio && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0 py-3">
                <h6 className="modal-title fw-bold"><XCircle size={18} className="me-2 mb-1"/>Confirmar Anulación</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)} disabled={cancelLoading}></button>
              </div>
              <div className="modal-body p-4">
                <p className="mb-3">Estás a punto de anular el pre-registro <strong>{envio.codigo_tracking}</strong>. Esta acción no tiene costo pero es irreversible.</p>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">DNI/RUC del Remitente (Por Seguridad)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ingresa tu documento..." 
                    value={docRemitente}
                    onChange={(e) => setDocRemitente(e.target.value)}
                    disabled={cancelLoading}
                  />
                </div>
                {cancelError && <div className="text-danger small mb-3">{cancelError}</div>}
              </div>
              <div className="modal-footer border-0 bg-light rounded-bottom-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)} disabled={cancelLoading}>Conservar Envío</button>
                <button type="button" className="btn btn-danger" onClick={handleCancelar} disabled={cancelLoading || !docRemitente.trim()}>
                  {cancelLoading ? 'Procesando...' : 'Sí, Anular Ahora'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {envio && (
        <ModalPagoYape 
          show={showPago}
          onClose={() => setShowPago(false)}
          onPaymentSuccess={() => consultarTracking(envio.codigo_tracking)}
          codigoTracking={envio.codigo_tracking}
          montoPagar={envio.precio_total}
        />
      )}
    </div>
  );
}
