import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [dni, setDni] = useState('00000001');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [curvePath, setCurvePath] = useState('');
  const { login, loading, authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Generador de la curva sinusoidal idéntica al monolito
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      const result = await login(dni, password);
      if (result.mfa_requerido) {
        navigate('/auth/2fa');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      // El error se gestiona en authError del contexto
    }
  };

  return (
    <main className="login-shell">
      {/* Columna Izquierda: Portada fotográfica del almacén */}
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

      {/* Columna Derecha: Formulario con divisor curvo */}
      <section className="form-panel">
        {/* Divisor curvo SVG */}
        <div className="curved-divider">
          <svg width="100%" height="100%" viewBox="0 0 320 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d={curvePath} fill="#f5f5f7" />
          </svg>
        </div>

        <div className="form-content">
          {/* Portada móvil visible solo en pantallas pequeñas */}
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

          {/* Badge corporativo */}
          <div className="brand-pill">
            <i className="bi bi-box-seam-fill"></i>
            <span>Portal de empleados</span>
          </div>

          <h2 className="form-title">Iniciar sesión</h2>
          <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

          {/* Indicador de progreso paso 1 de 2 */}
          <div className="step-indicator" aria-label="Progreso de autenticación">
            <div className="step-dot active">1</div>
            <div className="step-line"></div>
            <div className="step-dot pending">2</div>
          </div>

          {authError && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
              <div>{authError}</div>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label-auth" htmlFor="dniInput">DNI</label>
              <div className="field-wrap">
                <i className="bi bi-person"></i>
                <input
                  id="dniInput"
                  type="text"
                  required
                  maxLength={8}
                  inputMode="numeric"
                  placeholder="Ingresa tu DNI"
                  className="form-control-auth"
                  value={dni}
                  disabled={loading}
                  onChange={(e) => {
                    setDni(e.target.value);
                    if (authError) clearError();
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label-auth" htmlFor="passInput">Contraseña</label>
              <div className="field-wrap">
                <i className="bi bi-lock"></i>
                <input
                  id="passInput"
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Tu contraseña"
                  className="form-control-auth"
                  value={password}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) clearError();
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-right-circle"></i>
                  <span>Continuar</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/auth/recuperar-password" className="helper-link">
              ¿Olvidaste tu contraseña?
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
