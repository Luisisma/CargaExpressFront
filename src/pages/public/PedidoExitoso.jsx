import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, QrCode, ArrowLeft, Printer, Copy, Check, Truck, Box } from 'lucide-react';
import ModalPagoYape from '../../components/ModalPagoYape';

export default function PedidoExitoso() {
  const { tracking } = useParams();
  const location = useLocation();
  const [copiado, setCopiado] = useState(false);
  const [showPago, setShowPago] = useState(false);
  const [pagado, setPagado] = useState(false);

  const pedidoData = location.state?.pedido;
  const detalle = location.state?.detalle;

  const handleCopiar = () => {
    if (tracking) {
      navigator.clipboard.writeText(tracking);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="row justify-content-center py-2 py-md-4">
      <div className="col-lg-8 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-start">
          <div className="text-center text-success mb-3">
            <CheckCircle size={60} className="mx-auto text-success" />
          </div>

          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-1">¡Pre-registro Exitoso en CargaExpress!</h2>
            <p className="text-secondary small mx-auto" style={{ maxWidth: '540px' }}>
              Tu envío ha sido registrado en nuestra base de datos nacional. Presenta este comprobante o código de rastreo en la agencia para entregarlo al despachador.
            </p>
          </div>

          {/* Tarjeta de Código de Tracking Oficial */}
          <div className="p-4 bg-light rounded-4 border mb-4 text-center">
            <div className="small text-muted fw-bold text-uppercase mb-1" style={{ letterSpacing: '1px' }}>
              CÓDIGO OFICIAL DE SEGUIMIENTO (TRACKING)
            </div>
            <div className="display-6 fw-bold text-brand-primary mb-2" style={{ fontFamily: 'monospace' }}>
              {tracking || 'CE-2026-00001'}
            </div>

            <div className="d-flex justify-content-center gap-2 mb-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1"
                onClick={handleCopiar}
              >
                {copiado ? (
                  <>
                    <Check size={14} className="text-success" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            <div className="my-2 text-secondary">
              <QrCode size={110} className="mx-auto text-dark" />
            </div>

            <span className={`badge ${pagado ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fw-bold small mt-2`}>
              Estado: {pagado ? 'PAGADO' : 'REGISTRADO'} • {pagado ? 'Confirmado' : 'Pendiente pago/entrega'}
            </span>
          </div>

          {/* Ficha Resumen de la Encomienda y Desglose Contable */}
          {detalle && (
            <div className="border rounded-4 p-3 p-md-4 mb-4 bg-white">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                <Box size={18} className="text-primary" />
                <span>Resumen de la Orden de Servicio</span>
              </h6>

              <div className="row g-3 small">
                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block">Remitente:</span>
                  <strong className="text-dark">{detalle.remNombre}</strong>
                  <div className="text-secondary">Doc: {detalle.remDni}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block">Destinatario:</span>
                  <strong className="text-dark">{detalle.destNombre}</strong>
                  <div className="text-secondary">Doc: {detalle.destDni}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block">Origen:</span>
                  <strong className="text-dark">{detalle.origen}</strong>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block">Destino:</span>
                  <strong className="text-dark">{detalle.destino}</strong>
                  {detalle.direccionEntrega && (
                    <div className="text-primary mt-1">
                      <small>Entrega domicilio: {detalle.direccionEntrega}</small>
                    </div>
                  )}
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block">Paquete:</span>
                  <strong className="text-dark">
                    {detalle.tipoPaquete?.toUpperCase()} • {detalle.pesoKg} kg
                  </strong>
                </div>

                {pedidoData && (
                  <div className="col-12 col-sm-6">
                    <span className="text-muted d-block">Liquidación Contable SUNAT:</span>
                    <div className="text-secondary">Subtotal: S/ {Number(pedidoData.monto_subtotal).toFixed(2)}</div>
                    <div className="text-secondary">IGV (18%): S/ {Number(pedidoData.monto_igv).toFixed(2)}</div>
                    <div className="fw-bold text-success fs-6 mt-1">
                      Total a Pagar: S/ {Number(pedidoData.precio_estimado).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2">
            <Link to="/" className="btn btn-outline-secondary px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2">
              <ArrowLeft size={16} />
              <span>Volver al Inicio</span>
            </Link>

            <div className="d-flex gap-2">
              {!pagado && pedidoData && (
                <button
                  type="button"
                  className="btn btn-warning px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2 text-dark"
                  onClick={() => setShowPago(true)}
                >
                  <QrCode size={16} />
                  <span>Pagar con Yape (QR)</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-outline-dark px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2"
                onClick={handleImprimir}
              >
                <Printer size={16} />
                <span>Imprimir Hoja</span>
              </button>

              <Link
                to={`/tracking/${tracking}`}
                className="btn btn-brand px-4 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2"
              >
                <Truck size={16} />
                <span>Rastrear Envío en Vivo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <ModalPagoYape 
        show={showPago}
        onClose={() => setShowPago(false)}
        onPaymentSuccess={() => setPagado(true)}
        codigoTracking={tracking}
        montoPagar={pedidoData?.precio_estimado || 0}
      />
    </div>
  );
}
