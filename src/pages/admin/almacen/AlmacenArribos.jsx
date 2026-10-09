import React, { useState, useRef } from 'react';
import { PackageOpen, Search, CheckCircle2, ArrowDownCircle } from 'lucide-react';
import { envioService } from '../../../services/envioService';

export default function AlmacenArribos() {
  const [codigo, setCodigo] = useState('');
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [procesando, setProcesando] = useState(false);
  const inputRef = useRef(null);

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
      if (data.estado !== 'en_ruta') {
        inputRef.current?.select();
      }
    } catch (err) {
      setError(err.message || 'No se encontró el envío.');
      inputRef.current?.select();
    } finally {
      setLoading(false);
    }
  };

  const handleArribar = async () => {
    if (!envio) return;
    try {
      setProcesando(true);
      setError('');
      await envioService.arribarEnvio(envio.codigo_tracking, "Recibido en almacén destino con pistola láser.");
      setSuccess(`¡Paquete ${envio.codigo_tracking} recibido en agencia! (EN AGENCIA DESTINO)`);
      setEnvio({ ...envio, estado: 'en_agencia_destino' });
      
      setTimeout(() => {
        setCodigo('');
        setEnvio(null);
        setSuccess('');
        inputRef.current?.focus();
      }, 2500);

    } catch (err) {
      setError(err.message || 'Error al recepcionar arribo.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div>
      <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2 mb-4">
        <PackageOpen size={28} className="text-primary" />
        Arribos (Descarga de Camión)
      </h1>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 text-center">
              <h5 className="fw-bold mb-3">Descarga Rápida (Escáner)</h5>
              <p className="text-secondary small mb-4">Escanea el bulto bajando del camión para registrar su llegada a la ciudad.</p>
              
              <form onSubmit={buscarEnvio}>
                <div className="input-group input-group-lg mb-3">
                  <span className="input-group-text bg-white"><Search size={20}/></span>
                  <input 
                    type="text" 
                    className="form-control text-center fw-bold text-primary" 
                    placeholder="CE-XXXXX" 
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    ref={inputRef}
                    autoFocus
                  />
                </div>
                <button type="submit" className="d-none">Buscar</button>
              </form>

              {loading && <div className="spinner-border text-primary my-3" role="status"></div>}
              
              {error && <div className="alert alert-danger mt-3 text-start small fw-semibold border-0"><i className="bi bi-exclamation-triangle-fill me-1"></i>{error}</div>}
              {success && <div className="alert alert-success mt-3 text-start small fw-bold border-0"><i className="bi bi-check-circle-fill me-1"></i>{success}</div>}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          {envio ? (
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h4 className="fw-bold">{envio.codigo_tracking}</h4>
                  <span className="badge bg-secondary fs-6 rounded-pill">{envio.estado.toUpperCase()}</span>
                </div>
                <div className="bg-light rounded-3 p-3 mb-4 text-center border">
                  <div className="row">
                    <div className="col-6 border-end">
                      <small className="text-muted d-block">Origen</small>
                      <strong className="fs-5">{envio.agencia_origen.nombre}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Peso Físico</small>
                      <strong className="fs-5">{envio.peso_kg} kg</strong>
                    </div>
                  </div>
                </div>

                {envio.estado === 'en_ruta' ? (
                  <button 
                    className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 shadow"
                    onClick={handleArribar}
                    disabled={procesando}
                  >
                    <ArrowDownCircle size={24}/>
                    {procesando ? 'Procesando...' : 'RECIBIR PAQUETE EN ALMACÉN'}
                  </button>
                ) : envio.estado === 'en_agencia_destino' ? (
                  <div className="alert alert-success d-flex flex-column align-items-center justify-content-center text-center border-0 bg-success text-white py-4 rounded-4">
                    <CheckCircle2 size={40} className="mb-2"/>
                    <h5 className="fw-bold mb-0">Ya se encuentra en Agencia Destino</h5>
                  </div>
                ) : (
                  <div className="alert alert-warning text-center border-warning-subtle fw-bold">
                    Este paquete no puede ser recibido aquí. (Estado Actual: {envio.estado})
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center bg-light">
              <span className="text-muted opacity-50 fw-semibold">Esperando lectura de código...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
