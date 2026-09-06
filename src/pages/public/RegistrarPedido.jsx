import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrarPedido() {
  const navigate = useNavigate();

  // Paso actual (1: Remitente, 2: Destinatario, 3: Envío, 4: Confirmar)
  const [paso, setPaso] = useState(1);

  // Paso 1: Remitente
  const [remDocTipo, setRemDocTipo] = useState('dni'); // 'dni' o 'ruc'
  const [remDni, setRemDni] = useState('');
  const [remNombre, setRemNombre] = useState('');
  const [remNacimiento, setRemNacimiento] = useState('');
  const [remSexo, setRemSexo] = useState('');
  const [remEmail, setRemEmail] = useState('');
  const [remTelefono, setRemTelefono] = useState('');

  // Paso 2: Destinatario
  const [destDocTipo, setDestDocTipo] = useState('dni');
  const [destDni, setDestDni] = useState('');
  const [destNombre, setDestNombre] = useState('');
  const [destNacimiento, setDestNacimiento] = useState('');
  const [destSexo, setDestSexo] = useState('');
  const [destEmail, setDestEmail] = useState('');
  const [destTelefono, setDestTelefono] = useState('');

  // Paso 3: Envío
  const [tipoEnvio, setTipoEnvio] = useState('agencia_agencia');
  const [agenciaOrigen, setAgenciaOrigen] = useState('Lima - Sede Principal (San Miguel)');
  const [agenciaDestino, setAgenciaDestino] = useState('Arequipa - Parque Industrial');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [tipoPaquete, setTipoPaquete] = useState('caja');
  const [pesoKg, setPesoKg] = useState(1);
  const [descripcion, setDescripcion] = useState('Documentos y enseres personales');

  // Cálculos de tarifa idénticos al monolito
  const tarifaBase = 8.0;
  const tarifaPorKg = Number((pesoKg * 2.5).toFixed(2));
  const recargoDomicilio = tipoEnvio.includes('domicilio') ? 12.0 : 0.0;
  const factorDestino = 1.0;
  const precioTotal = ((tarifaBase + tarifaPorKg + recargoDomicilio) * factorDestino).toFixed(2);

  // Funcionalidad de prueba para simular consulta RENIEC/SUNAT
  const handleBuscarReniec = (rol) => {
    if (rol === 'rem') {
      if (remDni.length === 8) {
        setRemNombre('Juan Carlos Pérez Ramos');
        setRemNacimiento('14/05/1992');
        setRemSexo('Masculino');
        setRemEmail('juan.perez@ejemplo.pe');
        setRemTelefono('987654321');
      } else if (remDni.length === 11) {
        setRemNombre('DISTRIBUIDORA LOGÍSTICA DEL SUR S.A.C.');
        setRemEmail('contacto@logistica-sur.pe');
        setRemTelefono('01-4567890');
      }
    } else {
      if (destDni.length === 8) {
        setDestNombre('María Elena Gómez Flores');
        setDestNacimiento('22/10/1995');
        setDestSexo('Femenino');
        setDestEmail('maria.gomez@ejemplo.pe');
        setDestTelefono('912345678');
      } else if (destDni.length === 11) {
        setDestNombre('COMERCIAL LIMA INDUSTRIAL E.I.R.L.');
        setDestEmail('ventas@limaindustrial.pe');
        setDestTelefono('01-7891234');
      }
    }
  };

  const handleFinalizar = (e) => {
    e.preventDefault();
    const mockTracking = 'CE' + Math.floor(1000000000 + Math.random() * 9000000000);
    navigate(`/pedido-exitoso/${mockTracking}`);
  };

  return (
    <div className="container py-3 py-md-4">
      {/* Encabezado con ícono */}
      <div className="text-center mb-3">
        <i className="bi bi-box-seam text-primary" style={{ fontSize: '32px' }}></i>
        <h3 className="fw-bold mt-2 mb-1" style={{ color: 'var(--primary)', fontSize: 'clamp(20px, 4vw, 26px)' }}>
          Registrar Envío de Encomienda
        </h3>
        <p className="text-muted small px-2">Completa los datos de tu envío. Recibirás confirmación por correo.</p>
      </div>

      {/* Stepper responsive: en móviles muestra círculos y título del paso actual */}
      <div className="stepper-container" aria-label="Progreso del pedido">
        <div className={`stepper-item ${paso === 1 ? 'active' : paso > 1 ? 'done' : ''}`}>
          <div className="stepper-num">{paso > 1 ? <i className="bi bi-check fs-6"></i> : 1}</div>
          <div className="stepper-label">Remitente</div>
        </div>
        <div className={`stepper-line ${paso > 1 ? 'done' : ''}`}></div>

        <div className={`stepper-item ${paso === 2 ? 'active' : paso > 2 ? 'done' : ''}`}>
          <div className="stepper-num">{paso > 2 ? <i className="bi bi-check fs-6"></i> : 2}</div>
          <div className="stepper-label">Destinatario</div>
        </div>
        <div className={`stepper-line ${paso > 2 ? 'done' : ''}`}></div>

        <div className={`stepper-item ${paso === 3 ? 'active' : paso > 3 ? 'done' : ''}`}>
          <div className="stepper-num">{paso > 3 ? <i className="bi bi-check fs-6"></i> : 3}</div>
          <div className="stepper-label">Envío</div>
        </div>
        <div className={`stepper-line ${paso > 3 ? 'done' : ''}`}></div>

        <div className={`stepper-item ${paso === 4 ? 'active' : ''}`}>
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

      {/* Banner de precio flotante/resumen en móviles para que el usuario no pierda el costo de vista */}
      <div className="mobile-price-banner shadow-sm">
        <div className="small fw-semibold text-white-50">
          <i className="bi bi-calculator me-1"></i> Costo estimado:
        </div>
        <div className="fw-bold fs-5">S/ {precioTotal}</div>
      </div>

      <div className="row g-4 mt-1">
        {/* Columna principal del formulario */}
        <div className="col-lg-8">
          <div className="order-form-card mb-4">
            {/* PASO 1: Remitente */}
            {paso === 1 && (
              <div>
                <div className="order-section-header">
                  <i className="bi bi-person"></i>
                  <span>Datos del Remitente</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Tipo de documento *</label>
                      <div className="doc-type-group">
                        <button
                          type="button"
                          className={`doc-type-option ${remDocTipo === 'dni' ? 'active' : ''}`}
                          onClick={() => setRemDocTipo('dni')}
                        >
                          <i className="bi bi-person-vcard"></i>
                          <span>DNI</span>
                        </button>
                        <button
                          type="button"
                          className={`doc-type-option ${remDocTipo === 'ruc' ? 'active' : ''}`}
                          onClick={() => setRemDocTipo('ruc')}
                        >
                          <i className="bi bi-building"></i>
                          <span>RUC</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">{remDocTipo === 'dni' ? 'DNI *' : 'RUC *'}</label>
                      <div className="input-group">
                        <input
                          type="text"
                          required
                          maxLength={remDocTipo === 'dni' ? 8 : 11}
                          placeholder={remDocTipo === 'dni' ? 'DNI de 8 dígitos' : 'RUC de 11 dígitos'}
                          className="form-control"
                          value={remDni}
                          onChange={(e) => setRemDni(e.target.value.replace(/\D/g, ''))}
                        />
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center gap-1"
                          onClick={() => handleBuscarReniec('rem')}
                        >
                          <i className="bi bi-search"></i>
                          <span>Buscar</span>
                        </button>
                      </div>
                      <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                        Ingresa {remDocTipo === 'dni' ? '8 dígitos' : '11 dígitos'} y presiona Buscar para consultar RENIEC/SUNAT.
                      </small>
                    </div>

                    <div className="col-md-7">
                      <label className="form-label">Nombre completo / Razón Social *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nombre y apellidos"
                        className="form-control"
                        value={remNombre}
                        onChange={(e) => setRemNombre(e.target.value)}
                      />
                    </div>

                    <div className="col-6 col-md-6">
                      <label className="form-label">Nacimiento</label>
                      <input
                        type="text"
                        placeholder="dd/mm/aaaa"
                        readOnly
                        className="form-control bg-light"
                        value={remNacimiento}
                      />
                    </div>
                    <div className="col-6 col-md-6">
                      <label className="form-label">Sexo</label>
                      <input
                        type="text"
                        placeholder="Masculino/Femenino"
                        readOnly
                        className="form-control bg-light"
                        value={remSexo}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Correo electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="correo@ejemplo.com"
                        className="form-control"
                        value={remEmail}
                        onChange={(e) => setRemEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        required
                        placeholder="999 999 999"
                        className="form-control"
                        value={remTelefono}
                        onChange={(e) => setRemTelefono(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-brand-secondary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={() => setPaso(2)}
                    >
                      <span>Continuar</span>
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
                  <span>Datos del Destinatario</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Tipo de documento *</label>
                      <div className="doc-type-group">
                        <button
                          type="button"
                          className={`doc-type-option ${destDocTipo === 'dni' ? 'active' : ''}`}
                          onClick={() => setDestDocTipo('dni')}
                        >
                          <i className="bi bi-person-vcard"></i>
                          <span>DNI</span>
                        </button>
                        <button
                          type="button"
                          className={`doc-type-option ${destDocTipo === 'ruc' ? 'active' : ''}`}
                          onClick={() => setDestDocTipo('ruc')}
                        >
                          <i className="bi bi-building"></i>
                          <span>RUC</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">{destDocTipo === 'dni' ? 'DNI *' : 'RUC *'}</label>
                      <div className="input-group">
                        <input
                          type="text"
                          required
                          maxLength={destDocTipo === 'dni' ? 8 : 11}
                          placeholder={destDocTipo === 'dni' ? 'DNI de 8 dígitos' : 'RUC de 11 dígitos'}
                          className="form-control"
                          value={destDni}
                          onChange={(e) => setDestDni(e.target.value.replace(/\D/g, ''))}
                        />
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center gap-1"
                          onClick={() => handleBuscarReniec('dest')}
                        >
                          <i className="bi bi-search"></i>
                          <span>Buscar</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <label className="form-label">Nombre completo / Razón Social *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nombre y apellidos"
                        className="form-control"
                        value={destNombre}
                        onChange={(e) => setDestNombre(e.target.value)}
                      />
                    </div>

                    <div className="col-6 col-md-6">
                      <label className="form-label">Nacimiento</label>
                      <input
                        type="text"
                        placeholder="dd/mm/aaaa"
                        readOnly
                        className="form-control bg-light"
                        value={destNacimiento}
                      />
                    </div>
                    <div className="col-6 col-md-6">
                      <label className="form-label">Sexo</label>
                      <input
                        type="text"
                        placeholder="Masculino/Femenino"
                        readOnly
                        className="form-control bg-light"
                        value={destSexo}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Correo electrónico</label>
                      <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="form-control"
                        value={destEmail}
                        onChange={(e) => setDestEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        required
                        placeholder="999 999 999"
                        className="form-control"
                        value={destTelefono}
                        onChange={(e) => setDestTelefono(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4 nav-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3 py-2 rounded-3 btn-responsive-nav"
                      onClick={() => setPaso(1)}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Atrás
                    </button>
                    <button
                      type="button"
                      className="btn btn-brand-secondary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={() => setPaso(3)}
                    >
                      <span>Continuar</span>
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
                  <span>Datos del Envío</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Tipo de envío *</label>
                      <div className="row g-2">
                        {[
                          { val: 'agencia_agencia', lbl: 'Agencia → Agencia', icn: 'bi-building' },
                          { val: 'agencia_domicilio', lbl: 'Agencia → Domicilio', icn: 'bi-house-door' },
                          { val: 'domicilio_agencia', lbl: 'Domicilio → Agencia', icn: 'bi-arrow-right-circle' },
                          { val: 'domicilio_domicilio', lbl: 'Domicilio → Domicilio', icn: 'bi-arrow-left-right' },
                        ].map((t) => (
                          <div className="col-6 col-md-3" key={t.val}>
                            <div
                              className={`p-2 p-sm-3 rounded-3 text-center tipo-card h-100 d-flex flex-column align-items-center justify-content-center ${tipoEnvio === t.val ? 'selected' : ''}`}
                              onClick={() => setTipoEnvio(t.val)}
                            >
                              <i className={`bi ${t.icn} fs-4 mb-1 text-primary`}></i>
                              <small className="fw-bold" style={{ fontSize: '11px', lineHeight: '1.2' }}>
                                {t.lbl}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Agencia Origen *</label>
                      <select
                        className="form-select"
                        value={agenciaOrigen}
                        onChange={(e) => setAgenciaOrigen(e.target.value)}
                      >
                        <option value="Lima - Sede Principal (San Miguel)">Lima - Sede Principal (San Miguel)</option>
                        <option value="Arequipa - Parque Industrial">Arequipa - Parque Industrial</option>
                        <option value="Trujillo - Centro Histórico">Trujillo - Centro Histórico</option>
                        <option value="Chiclayo - Terminal Balta">Chiclayo - Terminal Balta</option>
                        <option value="Cusco - Terminal Terrestre">Cusco - Terminal Terrestre</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Agencia Destino *</label>
                      <select
                        className="form-select"
                        value={agenciaDestino}
                        onChange={(e) => setAgenciaDestino(e.target.value)}
                      >
                        <option value="Arequipa - Parque Industrial">Arequipa - Parque Industrial</option>
                        <option value="Lima - Sede Principal (San Miguel)">Lima - Sede Principal (San Miguel)</option>
                        <option value="Trujillo - Centro Histórico">Trujillo - Centro Histórico</option>
                        <option value="Chiclayo - Terminal Balta">Chiclayo - Terminal Balta</option>
                        <option value="Cusco - Terminal Terrestre">Cusco - Terminal Terrestre</option>
                      </select>
                      <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                        Ciudad / agencia donde llegará el paquete.
                      </small>
                    </div>

                    {tipoEnvio.includes('domicilio') && (
                      <div className="col-12">
                        <label className="form-label">Dirección exacta de entrega / recojo a domicilio *</label>
                        <input
                          type="text"
                          required
                          placeholder="Av. Ejemplo 123, Distrito, Ciudad"
                          className="form-control"
                          value={direccionEntrega}
                          onChange={(e) => setDireccionEntrega(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="col-6 col-md-4">
                      <label className="form-label">Tipo de paquete *</label>
                      <select
                        className="form-select"
                        value={tipoPaquete}
                        onChange={(e) => setTipoPaquete(e.target.value)}
                      >
                        <option value="caja">📦 Caja</option>
                        <option value="sobre">✉️ Sobre</option>
                        <option value="paquete">📫 Paquete</option>
                      </select>
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label">Peso (kg) *</label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        className="form-control"
                        value={pesoKg}
                        onChange={(e) => setPesoKg(Number(e.target.value))}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label">Descripción del contenido</label>
                      <input
                        type="text"
                        className="form-control"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4 nav-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3 py-2 rounded-3 btn-responsive-nav"
                      onClick={() => setPaso(2)}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Atrás
                    </button>
                    <button
                      type="button"
                      className="btn btn-brand-secondary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={() => setPaso(4)}
                    >
                      <span>Ver resumen</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: Confirmar */}
            {paso === 4 && (
              <div>
                <div className="order-section-header">
                  <i className="bi bi-check-circle"></i>
                  <span>Confirmar Pedido</span>
                </div>
                <div className="p-3 p-md-4">
                  <div className="border rounded-3 p-3 bg-light mb-4">
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Resumen de la Orden</h6>
                    <div className="row g-2 small">
                      <div className="col-12 col-sm-6">
                        <span className="text-muted">Remitente:</span>
                        <div className="fw-bold">{remNombre || 'Juan Pérez'} (DNI: {remDni || '79665184'})</div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <span className="text-muted">Destinatario:</span>
                        <div className="fw-bold">{destNombre || 'María Gómez'} (DNI: {destDni || '70891234'})</div>
                      </div>
                      <div className="col-12 col-sm-6 mt-2">
                        <span className="text-muted">Origen:</span>
                        <div className="fw-bold">{agenciaOrigen}</div>
                      </div>
                      <div className="col-12 col-sm-6 mt-2">
                        <span className="text-muted">Destino:</span>
                        <div className="fw-bold">{agenciaDestino}</div>
                      </div>
                      <div className="col-12 col-sm-6 mt-2">
                        <span className="text-muted">Paquete:</span>
                        <div className="fw-bold">{tipoPaquete.toUpperCase()} • {pesoKg} kg</div>
                      </div>
                      <div className="col-12 col-sm-6 mt-2">
                        <span className="text-muted">Total a Pagar:</span>
                        <div className="fw-bold text-success fs-6">S/ {precioTotal}</div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info rounded-3 mb-4" style={{ fontSize: '13px' }}>
                    <i className="bi bi-info-circle me-2"></i>
                    El pago se realizará en la ventanilla de la agencia al momento de entregar el paquete físico.
                  </div>

                  <div className="d-flex justify-content-between nav-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3 py-2 rounded-3 btn-responsive-nav"
                      onClick={() => setPaso(3)}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Atrás
                    </button>
                    <button
                      type="button"
                      className="btn btn-success px-4 px-md-5 py-2 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 btn-responsive-nav"
                      onClick={handleFinalizar}
                    >
                      <i className="bi bi-check-circle"></i>
                      <span>Confirmar y Registrar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Precio Estimado (idéntico a la captura) */}
        <div className="col-lg-4">
          <div className="precio-card sticky-top" style={{ top: '20px' }}>
            <p className="mb-1 text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.8px' }}>
              PRECIO ESTIMADO
            </p>
            <div className="precio-total mb-3">S/ {precioTotal}</div>

            <div className="precio-row">
              <span>Tarifa base</span>
              <span>S/ {tarifaBase.toFixed(2)}</span>
            </div>
            <div className="precio-row">
              <span>Por peso</span>
              <span>S/ {tarifaPorKg.toFixed(2)}</span>
            </div>
            {recargoDomicilio > 0 && (
              <div className="precio-row">
                <span>Domicilio</span>
                <span>S/ 12.00</span>
              </div>
            )}
            <div className="precio-row">
              <span>Factor destino</span>
              <span>×{factorDestino.toFixed(1)}</span>
            </div>

            <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-6">TOTAL</span>
              <span className="fw-bold fs-4">S/ {precioTotal}</span>
            </div>

            <p className="mt-3 text-white-50 mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
              <i className="bi bi-info-circle me-1"></i>
              Precio referencial. El cajero confirmará el monto al recibir el paquete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
