import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Truck, User, MapPin, AlertCircle, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { envioService } from '../../../services/envioService';

export default function EnvioDetalle() {
  const { id } = useParams();
  const [envio, setEnvio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Modal de Entrega
  const [showModalEntrega, setShowModalEntrega] = useState(false);
  const [formEntrega, setFormEntrega] = useState({
    dni_receptor: '',
    nombre_receptor: '',
    parentesco_o_relacion: 'Titular',
    observaciones: ''
  });
  const [procesandoEntrega, setProcesandoEntrega] = useState(false);
  const [mensajeExitoEntrega, setMensajeExitoEntrega] = useState('');


  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setCargando(true);
        setError('');
        const data = await envioService.getEnvioDetalle(id);
        setEnvio(data);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la información de la encomienda.');
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarDetalle();
    }
  }, [id]);

  const abrirModalEntrega = () => {
    if (!envio) return;
    setFormEntrega({
      dni_receptor: envio.destinatario?.numero_documento || '',
      nombre_receptor: envio.destinatario?.nombre_completo || '',
      parentesco_o_relacion: 'Titular',
      observaciones: ''
    });
    setShowModalEntrega(true);
  };

  const handleConfirmarEntrega = async (e) => {
    e.preventDefault();
    if (!formEntrega.dni_receptor.trim() || !formEntrega.nombre_receptor.trim()) {
      alert('Por favor ingresa el DNI y nombre de la persona que retira físicamente.');
      return;
    }

    setProcesandoEntrega(true);
    try {
      await envioService.entregarEnvio(envio.codigo_tracking, formEntrega);
      setMensajeExitoEntrega(`¡Encomienda ${envio.codigo_tracking} entregada exitosamente al destinatario!`);
      setShowModalEntrega(false);
      // Recargar datos actualizados
      const dataActualizada = await envioService.getEnvioDetalle(id);
      setEnvio(dataActualizada);
    } catch (err) {
      alert(err.message || 'Error al procesar la entrega.');
    } finally {
      setProcesandoEntrega(false);
    }
  };

  const getBadgeClass = (estado) => {
    const e = (estado || '').toLowerCase();
    if (e.includes('entregado')) return 'badge bg-success';
    if (e.includes('transito') || e.includes('ruta')) return 'badge bg-info text-dark';
    if (e.includes('destino')) return 'badge bg-primary text-white';
    if (e.includes('almacen') || e.includes('recepcionado')) return 'badge bg-warning text-dark';
    if (e.includes('registrado')) return 'badge bg-secondary';
    return 'badge bg-light text-dark border';
  };

  if (cargando) {
    return (
      <div className="p-5 text-center text-muted">
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <div>Cargando detalle de la encomienda...</div>
      </div>
    );
  }

  if (error || !envio) {
    return (
      <div className="p-4 text-center">
        <div className="alert alert-danger d-inline-flex align-items-center gap-2">
          <AlertCircle size={20} />
          <span>{error || 'Encomienda no encontrada.'}</span>
        </div>
        <div className="mt-3">
          <Link to="/admin/envios" className="btn btn-outline-secondary">
            <ArrowLeft size={16} className="me-1 inline" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner de Éxito de Entrega si recién se entregó */}
      {mensajeExitoEntrega && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4 rounded-4 shadow-sm" role="alert">
          <CheckCircle2 size={22} className="text-success" />
          <div className="fw-semibold">{mensajeExitoEntrega}</div>
          <button type="button" className="btn-close ms-auto" onClick={() => setMensajeExitoEntrega('')}></button>
        </div>
      )}

      {/* Banner Permanente si el estado ya es ENTREGADO */}
      {envio.estado === 'entregado' && (
        <div className="alert alert-success d-flex align-items-center gap-3 p-3 rounded-4 shadow-sm mb-4 border-0">
          <ShieldCheck size={32} className="text-success flex-shrink-0" />
          <div>
            <h6 className="fw-bold mb-0 text-success">¡Encomienda Entregada a Satisfacción!</h6>
            <small className="text-secondary">
              El paquete fue entregado físicamente al destinatario el {envio.fecha_entrega_real ? new Date(envio.fecha_entrega_real).toLocaleString('es-PE') : new Date(envio.actualizado_en).toLocaleString('es-PE')}.
            </small>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/envios" className="btn btn-outline-secondary rounded-3 p-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2 flex-wrap">
              <span>Encomienda {envio.codigo_tracking}</span>
              <span className={`${getBadgeClass(envio.estado)} rounded-pill fs-6 px-3 py-1`}>
                {envio.estado.replace('_', ' ').toUpperCase()}
              </span>
            </h3>
            <small className="text-secondary">
              Modalidad: <strong>{envio.tipo_envio === 'agencia_domicilio' ? 'Entrega a Domicilio' : 'Retiro en Agencia'}</strong> · Creado el {new Date(envio.creado_en).toLocaleString('es-PE')}
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* BOTÓN CLAVE: Entregar al Destinatario si ya está en destino o en reparto */}
          {['en_agencia_destino', 'en_reparto'].includes(envio.estado) && (
            <button
              onClick={abrirModalEntrega}
              className="btn btn-success fw-bold d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-3 py-2"
            >
              <CheckCircle2 size={18} />
              <span>Entregar al Destinatario</span>
            </button>
          )}

          <span className={`badge ${envio.estado_pago === 'pagado' ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 fs-6 rounded-pill`}>
            {envio.estado_pago === 'pagado' ? 'Pago Realizado' : 'Pago Pendiente'}
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Datos Técnicos y Financieros */}
        <div className="col-lg-8">
          {/* Card Paquete */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <Package size={20} className="text-primary" />
              <span>Especificaciones de la Encomienda</span>
            </h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <span className="text-muted small">Código de Tracking:</span>
                <h4 className="fw-bold text-primary mb-0">{envio.codigo_tracking}</h4>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small">Tarifa Total:</span>
                <h4 className="fw-bold text-success mb-0">S/ {envio.precio_envio.toFixed(2)}</h4>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small">Agencia Origen:</span>
                <p className="fw-semibold mb-0">
                  {envio.agencia_origen.nombre} ({envio.agencia_origen.departamento})
                </p>
                <small className="text-muted">{envio.agencia_origen.direccion}</small>
              </div>

              <div className="col-sm-6">
                <span className="text-muted small">Agencia Destino:</span>
                <p className="fw-semibold mb-0">
                  {envio.agencia_destino.nombre} ({envio.agencia_destino.departamento})
                </p>
                <small className="text-muted">{envio.agencia_destino.direccion}</small>
              </div>

              <div className="col-sm-4">
                <span className="text-muted small">Tipo de Paquete:</span>
                <p className="fw-semibold mb-0 text-capitalize">{envio.tipo_paquete}</p>
              </div>

              <div className="col-sm-4">
                <span className="text-muted small">Peso Físico:</span>
                <p className="fw-semibold mb-0">{envio.peso_kg} kg</p>
              </div>

              <div className="col-sm-4">
                <span className="text-muted small">Peso Volumétrico:</span>
                <p className="fw-semibold mb-0">{envio.peso_volumetrico ? `${envio.peso_volumetrico} kg` : 'N/A'}</p>
              </div>

              {envio.direccion_entrega && (
                <div className="col-12 mt-2 pt-2 border-top">
                  <span className="text-muted small">Dirección de Entrega a Domicilio:</span>
                  <p className="fw-semibold mb-0 text-primary">{envio.direccion_entrega}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card Historial y Cronología */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <Clock size={20} className="text-primary" />
              <span>Cronología e Hitos de Rastreo</span>
            </h5>
            {envio.historial && envio.historial.length > 0 ? (
              <div className="timeline-list">
                {envio.historial.map((h, idx) => (
                  <div key={idx} className="d-flex gap-3 mb-3">
                    <div className="timeline-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                      ✓
                    </div>
                    <div>
                      <div className="fw-bold text-dark text-capitalize">{h.estado.replace('_', ' ')}</div>
                      <small className="text-secondary d-block">{h.descripcion || 'Actualización de estado en el sistema.'}</small>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {new Date(h.creado_en).toLocaleString('es-PE')}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small mb-0">No hay eventos de historial adicionales registrados.</p>
            )}
          </div>
        </div>

        {/* Columna Derecha: Intervinientes y Finanzas */}
        <div className="col-lg-4">
          {/* Card Clientes */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <User size={20} className="text-primary" />
              <span>Clientes Intervinientes</span>
            </h5>

            <div className="mb-4">
              <span className="badge bg-light text-secondary border mb-1">REMITENTE</span>
              <p className="fw-bold text-dark mb-0">{envio.remitente.nombre_completo}</p>
              <small className="text-secondary d-block">
                {envio.remitente.tipo_documento.toUpperCase()}: {envio.remitente.numero_documento}
              </small>
              {envio.remitente.telefono && (
                <small className="text-muted d-block">Tel: {envio.remitente.telefono}</small>
              )}
            </div>

            <div>
              <span className="badge bg-light text-secondary border mb-1">DESTINATARIO</span>
              <p className="fw-bold text-dark mb-0">{envio.destinatario.nombre_completo}</p>
              <small className="text-secondary d-block">
                {envio.destinatario.tipo_documento.toUpperCase()}: {envio.destinatario.numero_documento}
              </small>
              {envio.destinatario.telefono && (
                <small className="text-muted d-block">Tel: {envio.destinatario.telefono}</small>
              )}
            </div>
          </div>

          {/* Card Desglose de Caja */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              <span>Desglose Tarifario</span>
            </h5>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-secondary">Subtotal (Base):</span>
              <span className="fw-semibold">S/ {envio.monto_subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-secondary">I.G.V. (18%):</span>
              <span className="fw-semibold">S/ {envio.monto_igv.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between border-top pt-2 mt-2">
              <strong className="text-dark">Total Liquidado:</strong>
              <strong className="text-success fs-5">S/ {envio.precio_envio.toFixed(2)}</strong>
            </div>

            <div className="mt-3 pt-2 border-top small text-muted">
              <div>Medio: <strong className="text-capitalize">{envio.forma_pago}</strong></div>
              <div>Lugar de Cobro: <strong className="text-capitalize">{envio.lugar_pago}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE ENTREGA FORMAL DE ENCOMIENDA (BR-ENV-04) */}
      {showModalEntrega && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom py-3 px-4 bg-success text-white rounded-top-4">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2 fs-6">
                  <CheckCircle2 size={20} />
                  <span>Entrega Física al Destinatario</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModalEntrega(false)}
                  disabled={procesandoEntrega}
                ></button>
              </div>

              <form onSubmit={handleConfirmarEntrega}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <small className="text-muted d-block mb-1">Destinatario Oficial en Guía:</small>
                    <div className="fw-bold text-dark">{envio.destinatario.nombre_completo}</div>
                    <small className="text-secondary">{envio.destinatario.tipo_documento.toUpperCase()}: {envio.destinatario.numero_documento}</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">
                      DNI / Documento de quien recoge <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Ej: 78945612"
                      value={formEntrega.dni_receptor}
                      onChange={(e) => setFormEntrega({ ...formEntrega, dni_receptor: e.target.value })}
                      required
                      maxLength={15}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">
                      Nombre Completo de quien recoge <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Nombres y Apellidos"
                      value={formEntrega.nombre_receptor}
                      onChange={(e) => setFormEntrega({ ...formEntrega, nombre_receptor: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">
                      Condición o Parentesco
                    </label>
                    <select
                      className="form-select rounded-3"
                      value={formEntrega.parentesco_o_relacion}
                      onChange={(e) => setFormEntrega({ ...formEntrega, parentesco_o_relacion: e.target.value })}
                    >
                      <option value="Titular">Titular (Destinatario mismo)</option>
                      <option value="Familiar Directo">Familiar Directo</option>
                      <option value="Apoderado con Carta Poder">Apoderado con Carta Poder</option>
                      <option value="Tercero Autorizado">Tercero Autorizado</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-secondary">
                      Observaciones de Entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3"
                      placeholder="Ej: Se verificó DNI físico original conforme."
                      value={formEntrega.observaciones}
                      onChange={(e) => setFormEntrega({ ...formEntrega, observaciones: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top py-2 px-4 bg-light rounded-bottom-4">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-3 px-3"
                    onClick={() => setShowModalEntrega(false)}
                    disabled={procesandoEntrega}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-success fw-bold rounded-3 px-3 d-inline-flex align-items-center gap-2"
                    disabled={procesandoEntrega}
                  >
                    {procesandoEntrega ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Registrando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Confirmar Entrega</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
