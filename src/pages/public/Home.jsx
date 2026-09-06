import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [trackingCode, setTrackingCode] = useState('');
  const navigate = useNavigate();

  const handleTracking = (e) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/tracking/${trackingCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div>
      {/* Hero original con degradado y responsividad para móviles */}
      <div className="hero">
        <div className="hero-content">
          <div className="container">
            <div className="row align-items-center g-4 g-lg-5">
              {/* Titular */}
              <div className="col-lg-6 text-white text-center text-lg-start">
                <h1 className="hero-title">
                  Envíos seguros a <br className="d-none d-sm-inline" />
                  todo el <span style={{ color: '#fbd38d' }}>Perú</span> <span className="d-inline-block">PE</span>
                </h1>
                <p className="hero-subtitle mx-auto mx-lg-0" style={{ maxWidth: '520px' }}>
                  Conectamos personas y negocios con envíos rápidos, seguros y confiables desde cualquier agencia del país.
                </p>

                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 gap-md-4">
                  <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
                    <i className="bi bi-shield-check-fill" style={{ color: '#68d391' }}></i>
                    <span>Seguro garantizado</span>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
                    <i className="bi bi-geo-alt-fill" style={{ color: '#76e4f7' }}></i>
                    <span>+20 agencias</span>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
                    <i className="bi bi-clock-fill" style={{ color: '#fbd38d' }}></i>
                    <span>Tracking en tiempo real</span>
                  </div>
                </div>
              </div>

              {/* Box Rastrear Encomienda exacto a la captura */}
              <div className="col-lg-6">
                <div className="tracking-box mx-auto" style={{ maxWidth: '540px' }}>
                  <h4 className="d-flex align-items-center gap-2">
                    <i className="bi bi-search" style={{ color: 'var(--primary-light)' }}></i>
                    <span>Rastrear Encomienda</span>
                  </h4>
                  <p className="subtitle">Ingresa tu código de tracking para ver el estado de tu envío</p>

                  <form onSubmit={handleTracking}>
                    <div className="tracking-input-group">
                      <input
                        type="text"
                        required
                        placeholder="CE-XXXXXXXXXX"
                        maxLength={15}
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                      />
                      <button type="submit">
                        <i className="bi bi-search"></i>
                        <span>Rastrear</span>
                      </button>
                    </div>
                  </form>

                  <div className="divider-text">o accede al sistema</div>

                  <div className="d-flex flex-column gap-2 gap-sm-3">
                    <Link to="/registrar-pedido" className="action-btn">
                      <div className="action-btn-icon blue">
                        <i className="bi bi-box-seam-fill"></i>
                      </div>
                      <div className="text-start">
                        <div className="action-btn-title">Registrar mi Pedido</div>
                        <p className="action-btn-desc">Envía una encomienda desde tu domicilio</p>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-secondary"></i>
                    </Link>

                    <Link to="/auth/login" className="action-btn">
                      <div className="action-btn-icon red">
                        <i className="bi bi-shield-lock-fill"></i>
                      </div>
                      <div className="text-start">
                        <div className="action-btn-title">Iniciar Sesión — Personal</div>
                        <p className="action-btn-desc">Acceso exclusivo para empleados</p>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-secondary"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección "¿Por qué elegirnos?" idéntica a la captura */}
      <section className="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '32px' }}>
              ¿Por qué elegirnos?
            </h2>
            <p style={{ color: '#718096', fontSize: '15px' }}>
              La solución logística más confiable del Perú
            </p>
          </div>

          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="feature-card">
                <div className="feature-icon" style={{ background: '#ebf8ff' }}>
                  <span style={{ fontSize: '30px' }}>📡</span>
                </div>
                <h5>Tracking en Tiempo Real</h5>
                <p>Monitorea tu encomienda en cada etapa del proceso de envío</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="feature-card">
                <div className="feature-icon" style={{ background: '#f0fff4' }}>
                  <span style={{ fontSize: '30px' }}>🔒</span>
                </div>
                <h5>Envíos Seguros</h5>
                <p>Tus paquetes protegidos con documentación y control riguroso</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="feature-card">
                <div className="feature-icon" style={{ background: '#fffbeb' }}>
                  <span style={{ fontSize: '30px' }}>🚀</span>
                </div>
                <h5>Entrega Rápida</h5>
                <p>Red de agencias en todos los departamentos del Perú</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="feature-card">
                <div className="feature-icon" style={{ background: '#fff5f5' }}>
                  <span style={{ fontSize: '30px' }}>📱</span>
                </div>
                <h5>Soporte WhatsApp</h5>
                <p>Consultas y cotizaciones al instante por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
