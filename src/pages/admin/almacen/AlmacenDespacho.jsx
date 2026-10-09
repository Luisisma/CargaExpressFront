import React, { useState, useRef } from 'react';
import { Truck, Search, CheckCircle2, ArrowRightCircle } from 'lucide-react';
import { envioService } from '../../../services/envioService';

export default function AlmacenDespacho() {
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
      // Auto-enfocar para permitir escaneo rápido continuo si falla o si ya está despachado
      if (data.estado !== 'recepcionado') {
        inputRef.current?.select();
      }
    } catch (err) {
      setError(err.message || 'No se encontró el envío.');
      inputRef.current?.select();
    } finally {
      setLoading(false);
    }
  };

  const handleDespachar = async () => {
    if (!envio) return;
    try {
      setProcesando(true);
      setError('');
      await envioService.despacharEnvio(envio.codigo_tracking, "Despachado con pistola láser desde almacén.");
      setSuccess(`¡Paquete ${envio.codigo_tracking} subido al camión! (EN RUTA)`);
      setEnvio({ ...envio, estado: 'en_ruta' });
      
      // Limpiar y enfocar para el siguiente escaneo rápido
      setTimeout(() => {
        setCodigo('');
        setEnvio(null);
        setSuccess('');
        inputRef.current?.focus();
      }, 2500);

    } catch (err) {
      setError(err.message || 'Error al despachar.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div>
      <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2 mb-4">
        <Truck size={28} className="text-primary" />
        Despacho a Ruta (Carga de Camión)
      </h1>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 text-center">
              <h5 className="fw-bold mb-3">Pistola Lectora (Escáner)</h5>
              <p className="text-secondary small mb-4">Conecta la pistola lectora o escribe el código y presiona Enter.</p>
              
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
                      <small className="text-muted d-block">Destino</small>
                      <strong className="fs-5">{envio.agencia_destino.nombre}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Peso Físico</small>
                      <strong className="fs-5">{envio.peso_kg} kg</strong>
                    </div>
                  </div>
                </div>

                {envio.estado === 'recepcionado' ? (
                  <button 
                    className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 shadow"
                    onClick={handleDespachar}
                    disabled={procesando}
                  >
                    <ArrowRightCircle size={24}/>
                    {procesando ? 'Procesando...' : 'SUBIR PAQUETE AL CAMIÓN'}
                  </button>
                ) : envio.estado === 'en_ruta' ? (
                  <div className="alert alert-success d-flex flex-column align-items-center justify-content-center text-center border-0 bg-success text-white py-4 rounded-4">
                    <CheckCircle2 size={40} className="mb-2"/>
                    <h5 className="fw-bold mb-0">Ya se encuentra EN RUTA</h5>
                  </div>
                ) : (
                  <div className="alert alert-warning text-center border-warning-subtle fw-bold">
                    Este paquete no puede ser despachado. (Estado Actual: {envio.estado})
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
