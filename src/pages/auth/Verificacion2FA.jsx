import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Verificacion2FA() {
  const [token, setToken] = useState('');
  const [curvePath, setCurvePath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const width = 320;
    const height = 1000;
    const baseX = 235;
    const amplitude = 62;
    const steps = 140;
    let path = `M ${width} 0 L ${baseX} 0 `;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = t * height;
      const x = baseX - amplitude * Math.sin(Math.PI * t);
      path += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }

    path += `L ${width} ${height} Z`;
    setCurvePath(path);
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <main className="login-shell">
      {/* Columna Izquierda: Portada fotográfica */}
      <section className="cover-panel" aria-label="Portada CargaExpress">
        <img src="/portada.jpg" alt="Equipo CargaExpress en almacén" />
        <div className="cover-copy">
          <div>
            <h1>
              Bienvenido a
              <br />
              <span>CargaExpress Peru</span>
            </h1>
            <p>Gestiona encomiendas, agencias, caja y entregas desde un solo sistema operativo.</p>
          </div>
        </div>
      </section>

      {/* Columna Derecha: Verificación 2FA */}
      <section className="form-panel">
        <div className="curved-divider">
          <svg width="100%" height="100%" viewBox="0 0 320 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d={curvePath} fill="#f5f5f7" />
          </svg>
        </div>

        <div className="form-content">
          <div className="mobile-cover">
            <img src="/portada.jpg" alt="Equipo CargaExpress en almacén" />
            <div className="mobile-copy">
              <h1>
                Bienvenido a
                <br />
                <span>CargaExpress Peru</span>
              </h1>
            </div>
          </div>

          <div className="brand-pill">
            <i className="bi bi-shield-check"></i>
            <span>Seguridad de acceso</span>
          </div>

          <h2 className="form-title">Verificación 2FA</h2>
          <p className="form-subtitle">Ingresa el código de 6 dígitos de tu aplicación autenticadora</p>

          {/* Indicador de progreso paso 2 de 2 */}
          <div className="step-indicator" aria-label="Progreso de autenticación">
            <div className="step-dot done">
              <i className="bi bi-check fs-5"></i>
            </div>
            <div className="step-line done"></div>
            <div className="step-dot active">2</div>
          </div>

          <form className="login-form" onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="form-label-auth text-center d-block" htmlFor="tokenInput">Código de 6 dígitos</label>
              <input
                id="tokenInput"
                type="text"
                maxLength={6}
                required
                autoFocus
                inputMode="numeric"
                pattern="\d{6}"
                placeholder="000000"
                className="form-control-auth text-center fw-bold fs-3"
                style={{ letterSpacing: '8px' }}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button type="submit" className="btn-login">
              <i className="bi bi-shield-lock"></i>
              <span>Verificar y acceder</span>
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/auth/login" className="helper-link">
              <i className="bi bi-arrow-left"></i>
              <span>Volver a credenciales</span>
            </Link>
          </div>

          <div className="public-link">
            <Link to="/">
              <i className="bi bi-globe me-1"></i>
              Ver sitio público
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
