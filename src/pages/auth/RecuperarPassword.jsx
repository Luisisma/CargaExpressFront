import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function RecuperarPassword() {
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [curvePath, setCurvePath] = useState('');

  // Generador de la curva sinusoidal idéntica al login
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
    if (!identificador.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const resp = await authService.solicitarRecuperacionPassword(identificador.trim());
      setResultado(resp?.data || { enviado: true });
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud de recuperación.');
    } finally {
      setLoading(false);
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

      {/* Columna Derecha: Formulario con divisor curvo responsivo */}
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
            <i className="bi bi-shield-lock-fill"></i>
            <span>Recuperación de credenciales</span>
          </div>

          <h2 className="form-title">Recuperar contraseña</h2>
          <p className="form-subtitle">
            Ingresa tu DNI o Correo Institucional registrado para recibir el enlace de restablecimiento seguro.
          </p>

          {error && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center my-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
              <div>{error}</div>
            </div>
          )}

          {resultado ? (
            <div className="text-center py-4 px-2 my-3 bg-white rounded-4 shadow-sm border">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3"
                style={{ width: '70px', height: '70px', fontSize: '32px' }}
              >
                <i className="bi bi-envelope-check-fill"></i>
              </div>
              <h4 className="fw-bold text-dark mb-2">¡Enlace de recuperación enviado!</h4>
              <p className="text-muted small mb-3 px-3">
                {resultado.mensaje || 'Hemos enviado las instrucciones a tu correo registrado.'}
              </p>

              <div className="alert alert-info py-2 px-3 small text-start mx-3 mb-4">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                <span>
                  El enlace es de un solo uso y expirará en <strong>15 minutos</strong>. Revisa tu bandeja de entrada o spam.
                </span>
              </div>

              {resultado.debug_reset_url && (
                <div className="p-3 mx-3 mb-4 bg-light border rounded-3 text-start">
                  <div className="d-flex align-items-center mb-1">
                    <span className="badge bg-primary me-2">Mailtrap Sandbox</span>
                    <small className="text-muted">Enlace capturado en entorno local:</small>
                  </div>
                  <p className="mb-0 small text-break">
                    <a href={resultado.debug_reset_url} className="text-primary text-decoration-none fw-semibold">
                      Abrir enlace directo de restablecimiento &rarr;
                    </a>
                  </p>
                </div>
              )}

              <div className="px-3">
                <Link to="/auth/login" className="btn-login text-decoration-none d-flex align-items-center justify-content-center">
                  <i className="bi bi-arrow-left me-2"></i>
                  <span>Volver al inicio de sesión</span>
                </Link>
              </div>
            </div>
          ) : (
            <form className="login-form mt-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label-auth" htmlFor="identificadorInput">
                  DNI o Correo Electrónico
                </label>
                <div className="field-wrap">
                  <i className="bi bi-person-badge"></i>
                  <input
                    id="identificadorInput"
                    type="text"
                    required
                    placeholder="Ej. 82922603 o cajero@cargaexpress.pe"
                    className="form-control-auth"
                    value={identificador}
                    disabled={loading}
                    onChange={(e) => {
                      setIdentificador(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>
                <div className="form-text small text-muted mt-2">
                  Te enviaremos un correo con un botón para definir tu nueva contraseña.
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>Enviando correo vía Mailtrap...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill me-2"></i>
                    <span>Enviar Enlace de Recuperación</span>
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <Link to="/auth/login" className="helper-link">
                  <i className="bi bi-arrow-left me-1"></i>
                  Regresar al inicio de sesión
                </Link>
              </div>
            </form>
          )}

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
