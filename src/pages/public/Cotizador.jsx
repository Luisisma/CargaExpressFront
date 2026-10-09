import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { publicService } from '../../services/publicService';

export default function Cotizador() {
  const navigate = useNavigate();

  // Agencias desde backend
  const [agencias, setAgencias] = useState([]);
  const [cargandoAgencias, setCargandoAgencias] = useState(true);

  // Parámetros de cotización
  const [agenciaOrigenId, setAgenciaOrigenId] = useState('');
  const [agenciaDestinoId, setAgenciaDestinoId] = useState('');
  const [tipoEnvio, setTipoEnvio] = useState('agencia_agencia');
  const [peso, setPeso] = useState(5.0);
  const [largo, setLargo] = useState(30);
  const [ancho, setAncho] = useState(20);
  const [alto, setAlto] = useState(20);

  // Cotización devuelta por el servidor
  const [cotizacion, setCotizacion] = useState({
    peso_fisico: 5.0,
    peso_volumetrico: 2.0,
    peso_liquidable: 5.0,
    tarifa_base: 8.0,
    tarifa_peso_adicional: 12.5,
    recargo_domicilio: 0.0,
    recargo_recojo: 0.0,
    precio_total: 20.5,
  });
  const [calculando, setCalculando] = useState(false);

  // Cargar agencias reales
  useEffect(() => {
    let activo = true;
    async function load() {
      try {
        setCargandoAgencias(true);
        const data = await publicService.getAgencias();
        if (activo && data && data.length > 0) {
          setAgencias(data);
          setAgenciaOrigenId(data[0].id);
          setAgenciaDestinoId(data.length > 1 ? data[1].id : data[0].id);
        }
      } catch (err) {
        console.warn('Error al cargar agencias:', err);
      } finally {
        if (activo) setCargandoAgencias(false);
      }
    }
    load();
    return () => {
      activo = false;
    };
  }, []);

  // Calcular tarifa en el servidor con debounce
  useEffect(() => {
    if (!agenciaOrigenId || !agenciaDestinoId || peso <= 0) return;

    let activo = true;
    const timer = setTimeout(async () => {
      try {
        setCalculando(true);
        const res = await publicService.cotizar({
          agencia_origen_id: Number(agenciaOrigenId),
          agencia_destino_id: Number(agenciaDestinoId),
          tipo_envio: tipoEnvio,
          peso_kg: Number(peso),
          largo_cm: Number(largo) || 20,
          ancho_cm: Number(ancho) || 20,
          alto_cm: Number(alto) || 20,
        });
        if (activo && res) {
          setCotizacion(res);
        }
      } catch (err) {
        console.warn('Error al cotizar:', err);
      } finally {
        if (activo) setCalculando(false);
      }
    }, 300);

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [agenciaOrigenId, agenciaDestinoId, tipoEnvio, peso, largo, ancho, alto]);

  // Redirigir a registrar pedido con datos precargados
  const handleProcederRegistro = () => {
    navigate('/registrar-pedido', {
      state: {
        cotizacionPrevia: {
          agencia_origen_id: Number(agenciaOrigenId),
          agencia_destino_id: Number(agenciaDestinoId),
          tipo_envio: tipoEnvio,
          peso_kg: Number(peso),
          largo_cm: Number(largo),
          ancho_cm: Number(ancho),
          alto_cm: Number(alto),
        },
      },
    });
  };

  return (
    <div className="row justify-content-center py-2 py-md-4">
      <div className="col-lg-9">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-brand-primary text-white p-3 rounded-4 shadow-sm">
              <Calculator size={28} />
            </div>
            <div>
              <h2 className="fw-bold text-dark mb-0">Cotizador Oficial de Envíos</h2>
              <p className="text-secondary small mb-0">
                Tarifas directas y transparentes calculadas en tiempo real según el peso físico y volumétrico SUNAT.
              </p>
            </div>
          </div>

          <div className="row g-3">
            {/* Modalidad de Envío */}
            <div className="col-12 mb-2">
              <label className="form-label fw-bold small text-secondary">Modalidad de Envío</label>
              <div className="row g-2">
                <div className="col-md-6 form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoEnvioCotizar"
                    id="optAgencia"
                    checked={tipoEnvio === 'agencia_agencia'}
                    onChange={() => setTipoEnvio('agencia_agencia')}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="optAgencia">
                    Agencia a Agencia
                  </label>
                </div>
                <div className="col-md-6 form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoEnvioCotizar"
                    id="optDomicilio"
                    checked={tipoEnvio === 'agencia_domicilio'}
                    onChange={() => setTipoEnvio('agencia_domicilio')}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="optDomicilio">
                    Agencia a Domicilio (+S/ 12.00)
                  </label>
                </div>
                <div className="col-md-6 form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoEnvioCotizar"
                    id="optRecojoAgencia"
                    checked={tipoEnvio === 'domicilio_agencia'}
                    onChange={() => setTipoEnvio('domicilio_agencia')}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="optRecojoAgencia">
                    Domicilio a Agencia (+S/ 15.00)
                  </label>
                </div>
                <div className="col-md-6 form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoEnvioCotizar"
                    id="optRecojoDomicilio"
                    checked={tipoEnvio === 'domicilio_domicilio'}
                    onChange={() => setTipoEnvio('domicilio_domicilio')}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="optRecojoDomicilio">
                    Domicilio a Domicilio (+S/ 27.00)
                  </label>
                </div>
              </div>
            </div>

            {/* Agencias Reales */}
            <div className="col-md-6">
              <label className="form-label fw-bold small text-secondary">Agencia Origen</label>
              {cargandoAgencias ? (
                <div className="form-control text-muted">Cargando sedes...</div>
              ) : (
                <select
                  className="form-select rounded-3 py-2"
                  value={agenciaOrigenId}
                  onChange={(e) => setAgenciaOrigenId(e.target.value)}
                >
                  {agencias.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.departamento}: {ag.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold small text-secondary">Agencia Destino</label>
              {cargandoAgencias ? (
                <div className="form-control text-muted">Cargando sedes...</div>
              ) : (
                <select
                  className="form-select rounded-3 py-2"
                  value={agenciaDestinoId}
                  onChange={(e) => setAgenciaDestinoId(e.target.value)}
                >
                  {agencias.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.departamento}: {ag.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-dark border-bottom pb-2 d-flex align-items-center gap-2">
                <Box size={18} className="text-primary" />
                <span>Dimensiones y Peso de la Carga</span>
              </h6>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-secondary fw-semibold">Peso Físico (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                className="form-control rounded-3"
                value={peso}
                onChange={(e) => setPeso(Math.max(0.1, Number(e.target.value)))}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small text-secondary fw-semibold">Largo (cm)</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                value={largo}
                onChange={(e) => setLargo(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small text-secondary fw-semibold">Ancho (cm)</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                value={ancho}
                onChange={(e) => setAncho(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small text-secondary fw-semibold">Alto (cm)</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                value={alto}
                onChange={(e) => setAlto(Math.max(1, Number(e.target.value)))}
              />
            </div>
          </div>

          {/* Tarjeta de Resultados */}
          <div className="p-4 bg-light rounded-4 border mt-4">
            <div className="row align-items-center">
              <div className="col-sm-7">
                <div className="small text-muted mb-1">
                  Peso tarifable (Mayor entre físico y volumétrico):
                </div>
                <div className="fw-bold text-dark fs-5">
                  {cotizacion.peso_liquidable} kg
                </div>
                <div className="small text-secondary mt-1">
                  Volumétrico: {cotizacion.peso_volumetrico} kg • Base provincial: S/ {cotizacion.tarifa_base.toFixed(2)}
                </div>
                {cotizacion.recargo_domicilio > 0 && (
                  <div className="small text-primary mt-1">
                    + Entrega a domicilio: S/ {cotizacion.recargo_domicilio.toFixed(2)}
                  </div>
                )}
                {cotizacion.recargo_recojo > 0 && (
                  <div className="small text-primary mt-1">
                    + Recojo en domicilio: S/ {cotizacion.recargo_recojo.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="col-sm-5 text-sm-end mt-3 mt-sm-0">
                <div className="small text-muted mb-1">
                  {calculando ? 'Calculando tarifa...' : 'Costo Total Estimado:'}
                </div>
                <div className="text-brand-secondary fw-bold fs-1">
                  S/ {cotizacion.precio_total.toFixed(2)}
                </div>
                <div className="small text-muted">Incluye 18% IGV</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="small text-muted d-flex align-items-center gap-1">
                <ShieldCheck size={16} className="text-success" />
                <span>Cálculo oficial verificado por la plataforma CargaExpress</span>
              </div>

              <button
                type="button"
                className="btn btn-brand px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center gap-2"
                onClick={handleProcederRegistro}
              >
                <span>Registrar este Envío Ahora</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
