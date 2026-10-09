import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock } from 'lucide-react';
import { publicService } from '../services/publicService';

// Utilidad para simular el cifrado HMAC-SHA256 con Web Crypto API nativo
async function generateSignature(payloadStr, secret) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', 
        enc.encode(secret), 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payloadStr));
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function ModalPagoYape({ 
  show, 
  onClose, 
  onPaymentSuccess, 
  codigoTracking, 
  montoPagar 
}) {
  const [paso, setPaso] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (show && paso === 1) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose(); // Cierra si expira
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [show, paso, onClose]);

  // Formato MM:SS
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const simularPagoWebhook = async () => {
    try {
      setProcesando(true);
      
      const payload = {
        transaction_id: "txn_" + Math.random().toString(36).substr(2, 9),
        codigo_tracking: codigoTracking,
        monto_pagado: parseFloat(montoPagar),
        moneda: "PEN",
        metodo_pago: "YAPE",
        estado: "COMPLETED"
      };

      const payloadStr = JSON.stringify(payload);
      const secret = "whsec_simulated_dev_key_2026";
      const signature = await generateSignature(payloadStr, secret);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/pagos/webhook-simulado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        },
        body: payloadStr
      });

      if (!response.ok) {
        throw new Error("El webhook falló");
      }

      setPaso(2); // Éxito
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setPaso(1);
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Error procesando pago simulado.");
    } finally {
      setProcesando(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          
          <div className="modal-header bg-brand border-0 px-4 py-3 text-white">
            <h5 className="modal-title fw-bold mb-0">Pasarela de Pago (Simulador)</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={procesando || paso === 2}></button>
          </div>

          <div className="modal-body p-4 text-center">
            {paso === 1 ? (
              <>
                <p className="text-secondary mb-2">Escanea el código QR con Yape o Plin</p>
                <div className="display-4 fw-bold text-dark mb-4">
                  S/ {Number(montoPagar).toFixed(2)}
                </div>
                
                <div className="bg-light p-4 rounded-4 d-inline-block border mb-4 shadow-sm position-relative">
                   <QrCode size={150} className="text-dark" />
                   {procesando && (
                      <div className="position-absolute top-50 start-50 translate-middle bg-white p-3 rounded-circle shadow">
                         <div className="spinner-border text-brand" role="status"></div>
                      </div>
                   )}
                </div>

                <div className="d-flex align-items-center justify-content-center gap-2 mb-3 text-danger fw-semibold">
                  <Clock size={18} />
                  <span>El código expira en {mins}:{secs}</span>
                </div>

                <div className="alert alert-warning text-start small p-2 mb-3 rounded-3 border-warning-subtle" style={{ fontSize: '11px' }}>
                  <strong><i className="bi bi-info-circle me-1"></i>Política de Peso y Medidas:</strong>
                  <br /> Al pagar online declaras los datos bajo tu responsabilidad. Si al entregar el paquete en mostrador la balanza indica mayor volumen/peso, se cobrará el reintegro. Si es menor, no aplican devoluciones parciales.
                </div>

                <button 
                  className="btn btn-brand btn-lg w-100 fw-bold rounded-pill" 
                  onClick={simularPagoWebhook}
                  disabled={procesando}
                >
                  {procesando ? 'Procesando Webhook...' : 'Simular Pago Exitoso'}
                </button>
              </>
            ) : (
              <div className="py-4">
                <CheckCircle size={80} className="text-success mx-auto mb-3" />
                <h4 className="fw-bold text-dark">¡Pago Exitoso!</h4>
                <p className="text-secondary">El webhook ha sido procesado. Actualizando estado...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
