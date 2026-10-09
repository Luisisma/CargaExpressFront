import React, { useState } from 'react';
import { Search, PackageCheck, FileText, CheckCircle2, AlertTriangle, Printer, Banknote } from 'lucide-react';
import { envioService } from '../../../services/envioService';

export default function RecepcionEnvios() {
  const [codigo, setCodigo] = useState('');
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Datos reales en balanza
  const [pesoReal, setPesoReal] = useState('');
  const [largoReal, setLargoReal] = useState('');
  const [anchoReal, setAnchoReal] = useState('');
  const [altoReal, setAltoReal] = useState('');

  const [observaciones, setObservaciones] = useState('');
  const [procesando, setProcesando] = useState(false);

  const buscarEnvio = async (e) => {
    if (e) e.preventDefault();
    if (!codigo.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setEnvio(null);

    try {
      const data = await envioService.getEnvioDetalle(codigo.trim().toUpperCase());
      setEnvio(data);
      setPesoReal(data.peso_kg || 1);
      setLargoReal(data.largo_cm || 20);
      setAnchoReal(data.ancho_cm || 20);
      setAltoReal(data.alto_cm || 20);
    } catch (err) {
      setError(err.message || 'No se encontró el envío con ese código.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecepcionar = async () => {
    if (!envio) return;
    
    try {
      setProcesando(true);
      setError('');
      await envioService.recepcionarEnvio(envio.codigo_tracking, {
        peso_real_kg: Number(pesoReal),
        largo_real_cm: Number(largoReal),
        ancho_real_cm: Number(anchoReal),
        alto_real_cm: Number(altoReal),
        observaciones: observaciones
      });
      setSuccess(`¡Bulto recepcionado con éxito! El estado de ${envio.codigo_tracking} cambió a RECEPCIONADO. Se generó la Guía Interna y se calcularon ajustes si aplica.`);
      
      // Actualizar el estado local para reflejar que ya se recepcionó
      setEnvio({
        ...envio,
        estado: 'recepcionado',
        estado_pago: envio.estado_pago === 'pendiente' ? 'pagado' : envio.estado_pago,
        lugar_pago: envio.estado_pago === 'pendiente' ? 'agencia' : envio.lugar_pago
      });
      
    } catch (err) {
      setError(err.message || 'Error al intentar recepcionar el paquete.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <PackageCheck size={28} className="text-primary" />
            Recepción en Ventanilla
          </h1>
          <p className="text-secondary mb-0">Módulo de Caja para admisión de bultos y generación de Guías de Remisión.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Search size={20} className="text-secondary" />
                Buscar Pre-registro
              </h5>
              <form onSubmit={buscarEnvio}>
                <div className="mb-3">
                  <label className="form-label small text-muted fw-semibold">Código de Tracking / DNI Remitente</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light" 
                    placeholder="Ej. CE-2026-00001" 
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
                  {loading ? 'Buscando...' : 'Consultar Sistema'}
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-3 mb-0 border-0 rounded-3 small">
                  <i className="bi bi-exclamation-circle me-1"></i> {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success mt-3 mb-0 border-0 rounded-3 small fw-semibold">
                  <i className="bi bi-check-circle-fill me-1"></i> {success}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {envio ? (
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold text-dark mb-1">{envio.codigo_tracking}</h4>
                    <span className={`badge ${envio.estado === 'registrado' ? 'bg-primary' : 'bg-success'} rounded-pill px-3`}>
                      ESTADO: {envio.estado.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="small text-muted mb-1">Costo Total</div>
                    <h3 className="fw-bold text-dark mb-0">S/ {envio.precio_envio.toFixed(2)}</h3>
                    {envio.estado_pago === 'pagado' ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle mt-1">
                        <CheckCircle2 size={12} className="me-1"/>PAGADO ONLINE
                      </span>
                    ) : (
                      <span className="badge bg-warning-subtle text-warning border border-warning-subtle mt-1">
                        <Banknote size={12} className="me-1"/>PENDIENTE DE PAGO
                      </span>
                    )}
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-secondary mb-2 small text-uppercase">Datos del Remitente</h6>
                    <div className="bg-light p-3 rounded-3 border h-100">
                      <p className="mb-1 fw-semibold text-dark">{envio.remitente.nombre_completo}</p>
                      <p className="mb-1 small text-muted">DNI/RUC: {envio.remitente.numero_documento}</p>
                      <p className="mb-0 small text-muted">Tel: {envio.remitente.telefono || '-'}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-secondary mb-2 small text-uppercase">Datos del Destinatario</h6>
                    <div className="bg-light p-3 rounded-3 border h-100">
                      <p className="mb-1 fw-semibold text-dark">{envio.destinatario.nombre_completo}</p>
                      <p className="mb-1 small text-muted">DNI/RUC: {envio.destinatario.numero_documento}</p>
                      <p className="mb-0 small text-muted">Tel: {envio.destinatario.telefono || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3 border mb-4">
                  <div className="row text-center">
                    <div className="col-4 border-end">
                      <div className="small text-muted mb-1">Origen</div>
                      <div className="fw-semibold">{envio.agencia_origen.nombre}</div>
                    </div>
                    <div className="col-4 border-end">
                      <div className="small text-muted mb-1">Destino / Modalidad</div>
                      <div className="fw-semibold text-primary">{envio.agencia_destino.nombre}</div>
                      <div className="small text-secondary">{envio.tipo_envio.replace('_', ' a ').toUpperCase()}</div>
                    </div>
                    <div className="col-4">
                      <div className="small text-muted mb-1">Carga Física</div>
                      <div className="fw-semibold">{envio.peso_kg} kg • {envio.tipo_paquete.toUpperCase()}</div>
                    </div>
                  </div>
                </div>

                {envio.estado === 'registrado' ? (
                  <div className="bg-primary-subtle border border-primary-subtle p-4 rounded-4">
                    <h6 className="fw-bold text-primary mb-3">Paso 1: Verificación de Dimensiones (Balanza)</h6>
                    <div className="row g-2 mb-3">
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Peso (kg)</label>
                        <input type="number" min="0.1" step="0.5" className="form-control form-control-sm" value={pesoReal} onChange={e=>setPesoReal(e.target.value)} disabled={procesando} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Largo (cm)</label>
                        <input type="number" min="1" className="form-control form-control-sm" value={largoReal} onChange={e=>setLargoReal(e.target.value)} disabled={procesando} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Ancho (cm)</label>
                        <input type="number" min="1" className="form-control form-control-sm" value={anchoReal} onChange={e=>setAnchoReal(e.target.value)} disabled={procesando} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Alto (cm)</label>
                        <input type="number" min="1" className="form-control form-control-sm" value={altoReal} onChange={e=>setAltoReal(e.target.value)} disabled={procesando} />
                      </div>
                    </div>
                    <small className="d-block text-primary mb-3" style={{fontSize: '11px'}}>El sistema recalculará la tarifa final. Si difiere de lo pagado online, se emitirá un reintegro en el historial.</small>

                    <h6 className="fw-bold text-primary mb-3">Paso 2: Admisión</h6>
                    {envio.estado_pago === 'pendiente' && (
                      <div className="alert alert-warning border-warning-subtle d-flex align-items-center gap-2 py-2 mb-3">
                        <AlertTriangle size={20}/>
                        <div>
                          <strong>Atención:</strong> El cliente debe abonar <strong>S/ {envio.precio_envio.toFixed(2)}</strong> en ventanilla en este momento.
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Observaciones (Opcional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej. La caja presenta un pequeño golpe en la esquina..." 
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        disabled={procesando}
                      />
                    </div>
                    
                    <button 
                      className="btn btn-primary fw-bold w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      onClick={handleRecepcionar}
                      disabled={procesando}
                    >
                      <Printer size={20} />
                      {procesando ? 'Procesando...' : (envio.estado_pago === 'pendiente' ? 'Cobrar y Emitir Guía de Remisión' : 'Confirmar Recepción y Emitir Guía')}
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-success d-flex flex-column align-items-center justify-content-center py-4 rounded-4 mb-0 border-0 bg-success text-white">
                    <CheckCircle2 size={40} className="mb-2"/>
                    <h5 className="fw-bold mb-1">Paquete Recepcionado</h5>
                    <p className="mb-3 opacity-75">El bulto ya fue ingresado a la agencia. La Guía de Remisión y Comprobante ya fueron emitidos.</p>
                    <button className="btn btn-light fw-bold px-4 d-flex align-items-center gap-2">
                      <Printer size={18}/>
                      Reimprimir Guía de Remisión
                    </button>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 h-100 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '400px'}}>
              <div className="text-center text-muted opacity-50">
                <FileText size={64} className="mb-3"/>
                <h5>Sin envío seleccionado</h5>
                <p className="small">Busca un código de tracking para iniciar la admisión.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
