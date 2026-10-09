import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { publicService } from '../../services/publicService';

export default function RegistrarPedido() {
  const navigate = useNavigate();
  const location = useLocation();

  // Paso actual (1: Remitente, 2: Destinatario, 3: Envío, 4: Confirmar)
  const [paso, setPaso] = useState(1);

  // Estado de Agencias reales desde backend
  const [agencias, setAgencias] = useState([]);
  const [cargandoAgencias, setCargandoAgencias] = useState(true);
  const [errorAgencias, setErrorAgencias] = useState('');

  // Paso 1: Remitente
  const [remDocTipo, setRemDocTipo] = useState('dni'); // 'dni' o 'ruc'
  const [remDni, setRemDni] = useState('');
  const [remNombre, setRemNombre] = useState('');
  const [remEmail, setRemEmail] = useState('');
  const [remTelefono, setRemTelefono] = useState('');
  const [buscandoRem, setBuscandoRem] = useState(false);
  const [remEncontradoMsg, setRemEncontradoMsg] = useState('');

  // Paso 2: Destinatario
  const [destDocTipo, setDestDocTipo] = useState('dni');
  const [destDni, setDestDni] = useState('');
  const [destNombre, setDestNombre] = useState('');
  const [destEmail, setDestEmail] = useState('');
  const [destTelefono, setDestTelefono] = useState('');
  const [buscandoDest, setBuscandoDest] = useState(false);
  const [destEncontradoMsg, setDestEncontradoMsg] = useState('');

  // Paso 3: Envío
  const [tipoEnvio, setTipoEnvio] = useState('agencia_agencia'); // 'agencia_agencia' | 'agencia_domicilio'
  const [agenciaOrigenId, setAgenciaOrigenId] = useState('');
  const [agenciaDestinoId, setAgenciaDestinoId] = useState('');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [direccionRecojo, setDireccionRecojo] = useState('');
  const [tipoPaquete, setTipoPaquete] = useState('caja');
  const [pesoKg, setPesoKg] = useState(1.0);
  const [largoCm, setLargoCm] = useState(20);
  const [anchoCm, setAnchoCm] = useState(20);
  const [altoCm, setAltoCm] = useState(20);
  const [descripcion, setDescripcion] = useState('Documentos y enseres personales');

  // Cotización calculada en Server-Side
  const [cotizacion, setCotizacion] = useState({
    peso_fisico: 1.0,
    peso_volumetrico: 1.33,
    peso_liquidable: 1.33,
    tarifa_base: 8.0,
    tarifa_peso_adicional: 3.33,
    recargo_domicilio: 0.0,
    precio_total: 11.33,
  });
  const [calculandoTarifa, setCalculandoTarifa] = useState(false);

  // Estado de envío de orden
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  // 1. Cargar Agencias reales de la Base de Datos
  useEffect(() => {
    let montado = true;
    async function cargarAgencias() {
      try {
        setCargandoAgencias(true);
        const data = await publicService.getAgencias();
        if (montado && data && data.length > 0) {
          setAgencias(data);
          // Si venimos del cotizador con datos previos
          const stateData = location.state?.cotizacionPrevia;
          if (stateData) {
            setAgenciaOrigenId(stateData.agencia_origen_id || data[0].id);
            setAgenciaDestinoId(stateData.agencia_destino_id || (data[1] ? data[1].id : data[0].id));
            if (stateData.peso_kg) setPesoKg(Number(stateData.peso_kg));
            if (stateData.largo_cm) setLargoCm(Number(stateData.largo_cm));
            if (stateData.ancho_cm) setAnchoCm(Number(stateData.ancho_cm));
            if (stateData.alto_cm) setAltoCm(Number(stateData.alto_cm));
            if (stateData.tipo_envio) setTipoEnvio(stateData.tipo_envio);
          } else {
            setAgenciaOrigenId(data[0].id);
            setAgenciaDestinoId(data.length > 1 ? data[1].id : data[0].id);
          }
        }
      } catch (err) {
        if (montado) {
          setErrorAgencias('No se pudieron cargar las agencias operativas. Verifique la conexión con el servidor.');
        }
      } finally {
        if (montado) setCargandoAgencias(false);
      }
    }
    cargarAgencias();
    return () => {
      montado = false;
    };
  }, [location.state]);

  // 2. Recalcular cotización server-side cuando cambian agencias, dimensiones o modalidad
  useEffect(() => {
    if (!agenciaOrigenId || !agenciaDestinoId || pesoKg <= 0) return;

    let cancelado = false;
    const timer = setTimeout(async () => {
      try {
        setCalculandoTarifa(true);
        const resultado = await publicService.cotizar({
          agencia_origen_id: Number(agenciaOrigenId),
          agencia_destino_id: Number(agenciaDestinoId),
          tipo_envio: tipoEnvio,
          peso_kg: Number(pesoKg),
          largo_cm: Number(largoCm) || 20.0,
          ancho_cm: Number(anchoCm) || 20.0,
          alto_cm: Number(altoCm) || 20.0,
        });
        if (!cancelado && resultado) {
          setCotizacion(resultado);
        }
      } catch (err) {
        console.warn('Error al calcular cotización en servidor:', err);
      } finally {
        if (!cancelado) setCalculandoTarifa(false);
      }
    }, 350);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [agenciaOrigenId, agenciaDestinoId, tipoEnvio, pesoKg, largoCm, anchoCm, altoCm]);

  // Búsqueda de cliente en Base de Datos de CargaExpress y RENIEC Oficial
  const handleBuscarCliente = async (rol) => {
    const doc = rol === 'rem' ? remDni.trim() : destDni.trim();
    const docTipo = rol === 'rem' ? remDocTipo : destDocTipo;
    const reqLen = docTipo === 'dni' ? 8 : 11;

    if (!doc || doc.length < reqLen) {
      const msg = `Ingresa los ${reqLen} dígitos del ${docTipo.toUpperCase()} para consultar.`;
      if (rol === 'rem') setRemEncontradoMsg(msg);
      else setDestEncontradoMsg(msg);
      return;
    }

    try {
      if (rol === 'rem') {
        setBuscandoRem(true);
        setRemEncontradoMsg('Consultando en RENIEC / Base CargaExpress...');
        const res = await publicService.buscarCliente(doc);
        if (res && res.encontrado && res.nombre_completo) {
          setRemNombre(res.nombre_completo);
          if (res.fuente === 'reniec') {
            setRemEncontradoMsg(`✓ RENIEC: Portador verificado (${res.nombre_completo})`);
          } else if (res.fuente === 'local') {
            setRemEncontradoMsg(`✓ Cliente frecuente en CargaExpress (${res.nombre_completo})`);
          } else if (res.fuente === 'sunat') {
            setRemEncontradoMsg(`✓ SUNAT: Razón social verificada (${res.nombre_completo})`);
          } else {
            setRemEncontradoMsg(`✓ Nombre obtenido: ${res.nombre_completo}`);
          }
        } else {
          setRemEncontradoMsg(res?.mensaje || 'ℹ️ Documento nuevo. Completa los nombres y teléfono manualmente.');
        }
      } else {
        setBuscandoDest(true);
        setDestEncontradoMsg('Consultando en RENIEC / Base CargaExpress...');
        const res = await publicService.buscarCliente(doc);
        if (res && res.encontrado && res.nombre_completo) {
          setDestNombre(res.nombre_completo);
          if (res.fuente === 'reniec') {
            setDestEncontradoMsg(`✓ RENIEC: Portador verificado (${res.nombre_completo})`);
          } else if (res.fuente === 'local') {
            setDestEncontradoMsg(`✓ Destinatario frecuente en CargaExpress (${res.nombre_completo})`);
          } else if (res.fuente === 'sunat') {
            setDestEncontradoMsg(`✓ SUNAT: Razón social verificada (${res.nombre_completo})`);
          } else {
            setDestEncontradoMsg(`✓ Nombre obtenido: ${res.nombre_completo}`);
          }
        } else {
          setDestEncontradoMsg(res?.mensaje || 'ℹ️ Destinatario nuevo. Completa sus datos para la recepción.');
        }
      }
    } catch (err) {
      if (rol === 'rem') setRemEncontradoMsg('Sin respuesta de consulta. Puedes ingresar el nombre manualmente.');
      else setDestEncontradoMsg('Sin respuesta de consulta. Puedes ingresar el nombre manualmente.');
    } finally {
      if (rol === 'rem') setBuscandoRem(false);
      else setBuscandoDest(false);
    }
  };

  // Validaciones antes de avanzar pasos
  const avanzarPaso2 = () => {
    if (!remDni || remDni.length < 8) {
      alert('Por favor ingresa un número de documento válido de al menos 8 dígitos.');
      return;
    }
    if (!remNombre.trim()) {
      alert('Por favor ingresa el nombre o razón social del remitente.');
      return;
    }
    if (!remTelefono.trim() || !/^\d{9}$/.test(remTelefono.trim())) {
      alert('Por favor ingresa un número de teléfono válido de 9 dígitos.');
      return;
    }
    if (!remEmail.trim() || !/^\S+@\S+\.\S+$/.test(remEmail.trim())) {
      alert('Por favor ingresa un correo electrónico válido con @.');
      return;
    }
    setPaso(2);
  };

  const avanzarPaso3 = () => {
    if (!destDni || destDni.length < 8) {
      alert('Por favor ingresa el documento de identidad del destinatario.');
      return;
    }
    if (!destNombre.trim()) {
      alert('Por favor ingresa el nombre del destinatario.');
      return;
    }
    if (!destTelefono.trim() || !/^\d{9}$/.test(destTelefono.trim())) {
      alert('Por favor ingresa un número de teléfono válido de 9 dígitos para el destinatario.');
      return;
    }
    if (!destEmail.trim() || !/^\S+@\S+\.\S+$/.test(destEmail.trim())) {
      alert('Por favor ingresa un correo electrónico válido con @ para el destinatario.');
      return;
    }
    setPaso(3);
  };

  const avanzarPaso4 = () => {
    if (!agenciaOrigenId || !agenciaDestinoId) {
      alert('Por favor selecciona las agencias de origen y destino.');
      return;
    }
    if (['agencia_domicilio', 'domicilio_domicilio'].includes(tipoEnvio) && !direccionEntrega.trim()) {
      alert('Para la modalidad de entrega a domicilio, ingresa la dirección exacta de entrega.');
      return;
    }
    if (['domicilio_agencia', 'domicilio_domicilio'].includes(tipoEnvio) && !direccionRecojo.trim()) {
      alert('Para la modalidad de recojo en domicilio, ingresa la dirección exacta de recojo.');
      return;
    }
    if (pesoKg <= 0) {
      alert('El peso del paquete debe ser mayor a 0 kg.');
      return;
    }
    setPaso(4);
  };

  // Envío final del pedido a la API
  const handleFinalizar = async (e) => {
    e.preventDefault();
    setErrorEnvio('');
    setEnviando(true);

    try {
      const payload = {
        rem_tipo_doc: remDocTipo,
        rem_num_doc: remDni.trim(),
        rem_nombre: remNombre.trim(),
        rem_email: remEmail.trim() || null,
        rem_telefono: remTelefono.trim() || null,

        dest_tipo_doc: destDocTipo,
        dest_num_doc: destDni.trim(),
        dest_nombre: destNombre.trim(),
        dest_email: destEmail.trim() || null,
        dest_telefono: destTelefono.trim() || null,

        agencia_origen_id: Number(agenciaOrigenId),
        agencia_destino_id: Number(agenciaDestinoId),
        tipo_envio: tipoEnvio,
        tipo_paquete: tipoPaquete,
        peso_kg: Number(pesoKg),
        largo_cm: Number(largoCm) || 20.0,
        ancho_cm: Number(anchoCm) || 20.0,
        alto_cm: Number(altoCm) || 20.0,
        descripcion: descripcion.trim() || 'Encomienda general',
        direccion_entrega: ['agencia_domicilio', 'domicilio_domicilio'].includes(tipoEnvio) ? direccionEntrega.trim() : null,
        direccion_recojo: ['domicilio_agencia', 'domicilio_domicilio'].includes(tipoEnvio) ? direccionRecojo.trim() : null,
      };

      const resultado = await publicService.registrarPedido(payload);

      // Obtener nombres legibles de agencias para la confirmación
      const origenObj = agencias.find((a) => String(a.id) === String(agenciaOrigenId));
      const destinoObj = agencias.find((a) => String(a.id) === String(agenciaDestinoId));

      navigate(`/pedido-exitoso/${resultado.codigo_tracking}`, {
        state: {
          pedido: resultado,
          detalle: {
            origen: origenObj ? `${origenObj.nombre} (${origenObj.departamento})` : 'Agencia Origen',
            destino: destinoObj ? `${destinoObj.nombre} (${destinoObj.departamento})` : 'Agencia Destino',
            remNombre,
            remDni,
            destNombre,
            destDni,
            tipoPaquete,
            pesoKg,
            direccionEntrega,
            tipoEnvio,
          },
        },
      });
    } catch (err) {
      setErrorEnvio(err.message || 'Ocurrió un error al registrar el pedido en el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  const agenciaOrigenSeleccionada = agencias.find((a) => String(a.id) === String(agenciaOrigenId));
  const agenciaDestinoSeleccionada = agencias.find((a) => String(a.id) === String(agenciaDestinoId));

  return (
    <div className="container py-3 py-md-4">
      {/* Encabezado con ícono */}
      <div className="text-center mb-3">
        <i className="bi bi-box-seam text-primary" style={{ fontSize: '32px' }}></i>
        <h3 className="fw-bold mt-2 mb-1" style={{ color: 'var(--primary)', fontSize: 'clamp(20px, 4vw, 26px)' }}>
          Registrar Envío de Encomienda
        </h3>
        <p className="text-muted small px-2">
          Registra tu encomienda como usuario invitado. Recibirás tu código de tracking de inmediato para entregarlo en ventanilla.
        </p>
      </div>

      {/* Stepper responsive */}
      <div className="stepper-container" aria-label="Progreso del pedido">
        <div className={`stepper-item ${paso === 1 ? 'active' : paso > 1 ? 'done' : ''}`} onClick={() => setPaso(1)} style={{ cursor: 'pointer' }}>
          <div className="stepper-num">{paso > 1 ? <i className="bi bi-check fs-6"></i> : 1}</div>
          <div className="stepper-label">Remitente</div>
        </div>
        <div className={`stepper-line ${paso > 1 ? 'done' : ''}`}></div>

        <div className={`stepper-item ${paso === 2 ? 'active' : paso > 2 ? 'done' : ''}`} onClick={() => paso > 1 && setPaso(2)} style={{ cursor: paso > 1 ? 'pointer' : 'default' }}>
          <div className="stepper-num">{paso > 2 ? <i className="bi bi-check fs-6"></i> : 2}</div>
          <div className="stepper-label">Destinatario</div>
        </div>
        <div className={`stepper-line ${paso > 2 ? 'done' : ''}`}></div>

        <div className={`stepper-item ${paso === 3 ? 'active' : paso > 3 ? 'done' : ''}`} onClick={() => paso > 2 && setPaso(3)} style={{ cursor: paso > 2 ? 'pointer' : 'default' }}>
          <div className="stepper-num">{paso > 3 ? <i className="bi bi-check fs-6"></i> : 3}</div>
          <div className="stepper-label">Envío</div>
        </div>
        <div className={`stepper-line ${paso > 3 ? 'done' : ''}`}></div>

        <div className={`stepper-item ${paso === 4 ? 'active' : ''}`} onClick={() => paso > 3 && setPaso(4)} style={{ cursor: paso > 3 ? 'pointer' : 'default' }}>
          <div className="stepper-num">4</div>
          <div className="stepper-label">Confirmar</div>
        </div>
      </div>

      {/* Indicador de texto solo para móviles */}
      <div className="d-block d-sm-none text-center mb-3">
        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill">
          Paso {paso} de 4: {paso === 1 ? 'Datos del Remitente' : paso === 2 ? 'Datos del Destinatario' : paso === 3 ? 'Datos del Envío' : 'Confirmar Pedido'}
        </span>
      </div>

      {/* Banner de precio flotante/resumen en móviles */}
      <div className="mobile-price-banner shadow-sm">
        <div className="small fw-semibold text-white-50">
          <i className="bi bi-calculator me-1"></i> Costo oficial:
        </div>
        <div className="fw-bold fs-5">
          S/ {cotizacion.precio_total.toFixed(2)}
          {calculandoTarifa && <span className="spinner-border spinner-border-sm ms-2" role="status"></span>}
        </div>
      </div>

      <div className="row g-4 mt-1">
        {/* Columna principal del formulario */}
        <div className="col-lg-8">
          {errorEnvio && (
            <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-3 shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <div>
                <strong>Error al registrar el pedido:</strong> {errorEnvio}
              </div>
            </div>
          )}

          <div className="order-form-card mb-4">
            {/* PASO 1: Remitente */}
            {paso === 1 && (
              <div>
                <div className="order-section-header">
                  <i className="bi bi-person"></i>
                  <span>Paso 1: Datos del Remitente (Quien envía)</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Tipo de documento *</label>
                      <div className="doc-type-group">
                        <button
                          type="button"
                          className={`doc-type-option ${remDocTipo === 'dni' ? 'active' : ''}`}
                          onClick={() => {
                            setRemDocTipo('dni');
                            setRemEncontradoMsg('');
                          }}
                        >
                          <i className="bi bi-person-vcard"></i>
                          <span>DNI (8 dígitos)</span>
                        </button>
                        <button
                          type="button"
                          className={`doc-type-option ${remDocTipo === 'ruc' ? 'active' : ''}`}
                          onClick={() => {
                            setRemDocTipo('ruc');
                            setRemEncontradoMsg('');
                          }}
                        >
                          <i className="bi bi-building"></i>
                          <span>RUC (11 dígitos)</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label fw-semibold">{remDocTipo === 'dni' ? 'Número de DNI *' : 'Número de RUC *'}</label>
                      <div className="input-group">
                        <input
                          type="text"
                          required
                          maxLength={remDocTipo === 'dni' ? 8 : 11}
                          placeholder={remDocTipo === 'dni' ? 'Ej: 45678912' : 'Ej: 20601234567'}
                          className="form-control"
                          value={remDni}
                          onChange={(e) => {
                            setRemDni(e.target.value.replace(/\D/g, ''));
                            setRemEncontradoMsg('');
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center gap-1"
                          onClick={() => handleBuscarCliente('rem')}
                          disabled={buscandoRem}
                        >
                          {buscandoRem ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <>
                              <i className="bi bi-search"></i>
                              <span>Buscar</span>
                            </>
                          )}
                        </button>
                      </div>
                      {remEncontradoMsg && (
                        <small className={`d-block mt-1 ${remEncontradoMsg.startsWith('✓') ? 'text-success fw-bold' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                          {remEncontradoMsg}
                        </small>
                      )}
                    </div>

                    <div className="col-md-7">
                      <label className="form-label fw-semibold">Nombre completo o Razón Social *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nombres y apellidos completos"
                        className="form-control"
                        value={remNombre}
                        onChange={(e) => setRemNombre(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Teléfono de contacto *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 987654321"
                        className="form-control"
                        value={remTelefono}
                        onChange={(e) => setRemTelefono(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Correo electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="notificaciones@correo.com"
                        className="form-control"
                        value={remEmail}
                        onChange={(e) => setRemEmail(e.target.value)}
                      />
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        Te enviaremos la copia digital de tu constancia de envío.
                      </small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-brand-secondary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={avanzarPaso2}
                    >
                      <span>Continuar a Destinatario</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: Destinatario */}
            {paso === 2 && (
              <div>
                <div className="order-section-header">
                  <i className="bi bi-person-check"></i>
                  <span>Paso 2: Datos del Destinatario (Quien recibe)</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Tipo de documento *</label>
                      <div className="doc-type-group">
                        <button
                          type="button"
                          className={`doc-type-option ${destDocTipo === 'dni' ? 'active' : ''}`}
                          onClick={() => {
                            setDestDocTipo('dni');
                            setDestEncontradoMsg('');
                          }}
                        >
                          <i className="bi bi-person-vcard"></i>
                          <span>DNI (8 dígitos)</span>
                        </button>
                        <button
                          type="button"
                          className={`doc-type-option ${destDocTipo === 'ruc' ? 'active' : ''}`}
                          onClick={() => {
                            setDestDocTipo('ruc');
                            setDestEncontradoMsg('');
                          }}
                        >
                          <i className="bi bi-building"></i>
                          <span>RUC (11 dígitos)</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label fw-semibold">{destDocTipo === 'dni' ? 'Número de DNI *' : 'Número de RUC *'}</label>
                      <div className="input-group">
                        <input
                          type="text"
                          required
                          maxLength={destDocTipo === 'dni' ? 8 : 11}
                          placeholder={destDocTipo === 'dni' ? 'Ej: 78945612' : 'Ej: 20123456789'}
                          className="form-control"
                          value={destDni}
                          onChange={(e) => {
                            setDestDni(e.target.value.replace(/\D/g, ''));
                            setDestEncontradoMsg('');
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center gap-1"
                          onClick={() => handleBuscarCliente('dest')}
                          disabled={buscandoDest}
                        >
                          {buscandoDest ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <>
                              <i className="bi bi-search"></i>
                              <span>Buscar</span>
                            </>
                          )}
                        </button>
                      </div>
                      {destEncontradoMsg && (
                        <small className={`d-block mt-1 ${destEncontradoMsg.startsWith('✓') ? 'text-success fw-bold' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                          {destEncontradoMsg}
                        </small>
                      )}
                    </div>

                    <div className="col-md-7">
                      <label className="form-label fw-semibold">Nombre completo o Razón Social *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nombres de quien recogerá o recibirá el paquete"
                        className="form-control"
                        value={destNombre}
                        onChange={(e) => setDestNombre(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Teléfono de contacto del destinatario *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 912345678"
                        className="form-control"
                        value={destTelefono}
                        onChange={(e) => setDestTelefono(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Correo electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="destinatario@correo.com"
                        className="form-control"
                        value={destEmail}
                        onChange={(e) => setDestEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4 nav-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3 py-2 rounded-3 btn-responsive-nav"
                      onClick={() => setPaso(1)}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Volver a Remitente
                    </button>
                    <button
                      type="button"
                      className="btn btn-brand-secondary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={avanzarPaso3}
                    >
                      <span>Continuar a Datos de Envío</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Datos del Envío */}
            {paso === 3 && (
              <div>
                <div className="order-section-header">
                  <i className="bi bi-box"></i>
                  <span>Paso 3: Datos del Paquete y Modalidad de Entrega</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Modalidad de entrega *</label>
                      <div className="row g-2">
                        <div className="col-6 col-md-3">
                          <div
                            className={`p-3 rounded-3 text-center tipo-card h-100 d-flex flex-column align-items-center justify-content-center ${tipoEnvio === 'agencia_agencia' ? 'selected' : ''}`}
                            onClick={() => setTipoEnvio('agencia_agencia')}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="bi bi-building fs-3 mb-1 text-primary"></i>
                            <span className="fw-bold small">Agencia a Agencia</span>
                            <small className="text-muted" style={{ fontSize: '11px' }}>Retiro en agencia</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div
                            className={`p-3 rounded-3 text-center tipo-card h-100 d-flex flex-column align-items-center justify-content-center ${tipoEnvio === 'agencia_domicilio' ? 'selected' : ''}`}
                            onClick={() => setTipoEnvio('agencia_domicilio')}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="bi bi-house-door fs-3 mb-1 text-primary"></i>
                            <span className="fw-bold small">Agencia a Domicilio</span>
                            <small className="text-muted" style={{ fontSize: '11px' }}>Entrega en puerta</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div
                            className={`p-3 rounded-3 text-center tipo-card h-100 d-flex flex-column align-items-center justify-content-center ${tipoEnvio === 'domicilio_agencia' ? 'selected' : ''}`}
                            onClick={() => setTipoEnvio('domicilio_agencia')}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="bi bi-truck fs-3 mb-1 text-primary"></i>
                            <span className="fw-bold small">Domicilio a Agencia</span>
                            <small className="text-muted" style={{ fontSize: '11px' }}>Recojo en puerta</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div
                            className={`p-3 rounded-3 text-center tipo-card h-100 d-flex flex-column align-items-center justify-content-center ${tipoEnvio === 'domicilio_domicilio' ? 'selected' : ''}`}
                            onClick={() => setTipoEnvio('domicilio_domicilio')}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="bi bi-house-door-fill fs-3 mb-1 text-primary"></i>
                            <span className="fw-bold small">Domicilio a Domicilio</span>
                            <small className="text-muted" style={{ fontSize: '11px' }}>Puerta a puerta</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selectores de Agencias desde la BDD */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Agencia Origen (Donde entregas el paquete) *</label>
                      {cargandoAgencias ? (
                        <div className="form-control text-muted">Cargando agencias...</div>
                      ) : (
                        <select
                          className="form-select"
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
                      {agenciaOrigenSeleccionada && (
                        <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                          <i className="bi bi-geo-alt me-1"></i>
                          {agenciaOrigenSeleccionada.direccion} ({agenciaOrigenSeleccionada.distrito})
                        </small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Agencia Destino (Donde arriba la carga) *</label>
                      {cargandoAgencias ? (
                        <div className="form-control text-muted">Cargando agencias...</div>
                      ) : (
                        <select
                          className="form-select"
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
                      {agenciaDestinoSeleccionada && (
                        <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                          <i className="bi bi-geo-alt me-1"></i>
                          {agenciaDestinoSeleccionada.direccion} ({agenciaDestinoSeleccionada.distrito})
                        </small>
                      )}
                    </div>

                    {['agencia_domicilio', 'domicilio_domicilio'].includes(tipoEnvio) && (
                      <div className="col-12">
                        <label className="form-label fw-semibold text-primary">
                          <i className="bi bi-geo-alt-fill me-1"></i> Dirección exacta de entrega a domicilio *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Av. Las Begonias 450, Dpto 302, San Isidro, Lima"
                          className="form-control border-primary"
                          value={direccionEntrega}
                          onChange={(e) => setDireccionEntrega(e.target.value)}
                        />
                      </div>
                    )}
                    
                    {['domicilio_agencia', 'domicilio_domicilio'].includes(tipoEnvio) && (
                      <div className="col-12">
                        <label className="form-label fw-semibold text-primary">
                          <i className="bi bi-geo-alt-fill me-1"></i> Dirección exacta de recojo (Tu domicilio) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Av. Salaverry 1000, Jesús María, Lima"
                          className="form-control border-primary"
                          value={direccionRecojo}
                          onChange={(e) => setDireccionRecojo(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Tipo de paquete *</label>
                      <select
                        className="form-select"
                        value={tipoPaquete}
                        onChange={(e) => setTipoPaquete(e.target.value)}
                      >
                        <option value="caja">📦 Caja</option>
                        <option value="sobre">✉️ Sobre / Documentos</option>
                        <option value="paquete">📫 Paquete / Bulto</option>
                        <option value="saco">🛍️ Saco / Mercadería</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Peso físico (kg) *</label>
                      <input
                        type="number"
                        min="0.1"
                        max="500"
                        step="0.5"
                        className="form-control"
                        value={pesoKg}
                        onChange={(e) => setPesoKg(Math.max(0.1, Number(e.target.value)))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Descripción de contenido</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Ropa, repuestos, calzado..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                    </div>

                    {/* Dimensiones para cálculo volumétrico */}
                    <div className="col-12 mt-3 pt-2 border-top">
                      <label className="form-label small fw-semibold text-secondary d-flex align-items-center justify-content-between">
                        <span>Dimensiones del bulto (cm) para cálculo volumétrico SUNAT</span>
                        <span className="badge bg-light text-dark border">Fórmula: (L × A × H) / 6000</span>
                      </label>
                      <div className="row g-2">
                        <div className="col-4">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">Largo</span>
                            <input
                              type="number"
                              min="1"
                              max="300"
                              className="form-control"
                              value={largoCm}
                              onChange={(e) => setLargoCm(Number(e.target.value))}
                            />
                            <span className="input-group-text">cm</span>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">Ancho</span>
                            <input
                              type="number"
                              min="1"
                              max="300"
                              className="form-control"
                              value={anchoCm}
                              onChange={(e) => setAnchoCm(Number(e.target.value))}
                            />
                            <span className="input-group-text">cm</span>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">Alto</span>
                            <input
                              type="number"
                              min="1"
                              max="300"
                              className="form-control"
                              value={altoCm}
                              onChange={(e) => setAltoCm(Number(e.target.value))}
                            />
                            <span className="input-group-text">cm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4 nav-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3 py-2 rounded-3 btn-responsive-nav"
                      onClick={() => setPaso(2)}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Volver a Destinatario
                    </button>
                    <button
                      type="button"
                      className="btn btn-brand-secondary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={avanzarPaso4}
                    >
                      <span>Revisar y Confirmar</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: Confirmar y Persistir en BDD */}
            {paso === 4 && (
              <div>
                <div className="order-section-header">
                  <i className="bi bi-check-circle"></i>
                  <span>Paso 4: Resumen y Confirmación de Pre-registro</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="border rounded-3 p-3 bg-light mb-4 shadow-sm">
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                      <span>Ficha Técnica del Envío</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        Cotizado en Servidor
                      </span>
                    </h6>

                    <div className="row g-3 small">
                      <div className="col-12 col-sm-6">
                        <span className="text-muted d-block">Remitente:</span>
                        <div className="fw-bold text-dark">{remNombre}</div>
                        <div className="text-secondary">{remDocTipo.toUpperCase()}: {remDni} • Tel: {remTelefono}</div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <span className="text-muted d-block">Destinatario:</span>
                        <div className="fw-bold text-dark">{destNombre}</div>
                        <div className="text-secondary">{destDocTipo.toUpperCase()}: {destDni} • Tel: {destTelefono}</div>
                      </div>

                      <div className="col-12 col-sm-6 mt-2 pt-2 border-top">
                        <span className="text-muted d-block">Ruta de Transporte:</span>
                        <div className="fw-bold">
                          {agenciaOrigenSeleccionada ? agenciaOrigenSeleccionada.nombre : 'Origen'} →{' '}
                          {agenciaDestinoSeleccionada ? agenciaDestinoSeleccionada.nombre : 'Destino'}
                        </div>
                        <div className="text-muted small">
                          Modalidad: {tipoEnvio === 'agencia_domicilio' ? 'Entrega a Domicilio' : 'Retiro en Agencia Destino'}
                        </div>
                        {tipoEnvio === 'agencia_domicilio' && (
                          <div className="text-primary mt-1 fw-semibold">
                            <i className="bi bi-pin-map me-1"></i> {direccionEntrega}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-sm-6 mt-2 pt-2 border-top">
                        <span className="text-muted d-block">Detalle del Bulto:</span>
                        <div className="fw-bold text-dark">
                          {tipoPaquete.toUpperCase()} • {pesoKg} kg (Vol: {cotizacion.peso_volumetrico} kg)
                        </div>
                        <div className="text-muted small">
                          Contenido: {descripcion || 'Encomienda general'}
                        </div>
                      </div>

                      <div className="col-12 mt-2 pt-2 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-dark">Total a pagar al entregar en agencia:</span>
                          <span className="fw-bold text-success fs-5">S/ {cotizacion.precio_total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info rounded-3 mb-4 d-flex align-items-start gap-2" style={{ fontSize: '13px' }}>
                    <i className="bi bi-info-circle-fill mt-1 fs-5"></i>
                    <div>
                      <strong>Importante:</strong> Al hacer clic en <em>Confirmar y Registrar</em>, se creará un código de tracking oficial (ej: CE-2026-NNNNN). Acércate con este código y tu paquete a la agencia de origen para formalizar el despacho físico.
                    </div>
                  </div>

                  <div className="d-flex justify-content-between nav-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3 py-2 rounded-3 btn-responsive-nav"
                      onClick={() => setPaso(3)}
                      disabled={enviando}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Volver a Envío
                    </button>
                    <button
                      type="button"
                      className="btn btn-success px-4 px-md-5 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={handleFinalizar}
                      disabled={enviando}
                    >
                      {enviando ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Registrando en Servidor...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i>
                          <span>Confirmar y Registrar Encomienda</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Precio Oficial Server-Side */}
        <div className="col-lg-4">
          <div className="precio-card sticky-top" style={{ top: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.8px' }}>
                TARIFA OFICIAL
              </span>
              {calculandoTarifa && (
                <span className="badge bg-white text-dark small py-1 px-2" style={{ fontSize: '10px' }}>
                  Calculando...
                </span>
              )}
            </div>

            <div className="precio-total mb-3">S/ {cotizacion.precio_total.toFixed(2)}</div>

            <div className="precio-row">
              <span>Tarifa base provincial</span>
              <span>S/ {cotizacion.tarifa_base.toFixed(2)}</span>
            </div>
            <div className="precio-row">
              <span>
                Por peso liquidable ({cotizacion.peso_liquidable} kg)
              </span>
              <span>S/ {cotizacion.tarifa_peso_adicional.toFixed(2)}</span>
            </div>
            {cotizacion.recargo_domicilio > 0 && (
              <div className="precio-row">
                <span>Entrega a domicilio</span>
                <span>S/ {cotizacion.recargo_domicilio.toFixed(2)}</span>
              </div>
            )}
            <div className="precio-row">
              <span>Peso volumétrico</span>
              <span>{cotizacion.peso_volumetrico} kg</span>
            </div>

            <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-6">TOTAL ESTIMADO</span>
              <span className="fw-bold fs-4">S/ {cotizacion.precio_total.toFixed(2)}</span>
            </div>

            <div className="mt-2 text-white-50" style={{ fontSize: '11px' }}>
              Incluye IGV (18%). Tarifa calculada según regulaciones del MTC y SUNAT.
            </div>

            <p className="mt-3 text-white-50 mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
              <i className="bi bi-info-circle me-1"></i>
              Pre-registro digital. El cajero comprobará peso y dimensiones en ventanilla al momento del pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
