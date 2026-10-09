import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [codigoTotp, setCodigoTotp] = useState('');
  const [requiereTotp, setRequiereTotp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [curvePath, setCurvePath] = useState('');

  // Curva sinusoidal estética idéntica al login de CargaExpress
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

  // Reglas de validación de seguridad de contraseña en tiempo real
  const securityRules = useMemo(() => {
    return {
      hasMinLength: nuevaPassword.length >= 8,
      hasUpper: /[A-Z]/.test(nuevaPassword),
      hasLower: /[a-z]/.test(nuevaPassword),
      hasNumber: /[0-9]/.test(nuevaPassword),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\/~`]/.test(nuevaPassword),
    };
  }, [nuevaPassword]);

  // Cálculo de fortaleza (0 a 5 puntos)
  const strengthScore = useMemo(() => {
    let score = 0;
    if (securityRules.hasMinLength) score++;
    if (securityRules.hasUpper) score++;
    if (securityRules.hasLower) score++;
    if (securityRules.hasNumber) score++;
    if (securityRules.hasSymbol) score++;
    return score;
  }, [securityRules]);

  const isPasswordSecure = strengthScore === 5;
  const passwordsMatch = nuevaPassword.length > 0 && nuevaPassword === confirmarPassword;

  const strengthLabel = useMemo(() => {
    if (nuevaPassword.length === 0) return { text: '', color: 'bg-secondary', width: '0%' };
    if (strengthScore <= 2) return { text: 'Débil', color: 'bg-danger', width: '35%' };
    if (strengthScore <= 4) return { text: 'Media', color: 'bg-warning', width: '70%' };
    return { text: 'Fuerte y Segura', color: 'bg-success', width: '100%' };
  }, [strengthScore, nuevaPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('No se proporcionó un token válido de restablecimiento.');
      return;
    }

    if (!isPasswordSecure) {
      setError('La contraseña debe cumplir con todos los requisitos de seguridad (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo).');
      return;
    }

    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    if (requiereTotp && (!codigoTotp || codigoTotp.length !== 6)) {
      setError('Debe ingresar el código numérico de 6 dígitos de su aplicación 2FA.');
      return;
    }

    setLoading(true);

    try {
      await authService.restablecerPassword({
        token,
        nueva_password: nuevaPassword,
        codigo_totp: codigoTotp || null
      });

      setExito(true);
      setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 3500);
    } catch (err) {
      const msg = err.message || 'Error al restablecer contraseña.';
      if (err.status === 422 || msg.toLowerCase().includes('2fa') || msg.toLowerCase().includes('dos pasos')) {
        setRequiereTotp(true);
      }
      setError(msg);
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
            <i className="bi bi-shield-check"></i>
            <span>Seguridad de credenciales</span>
          </div>

          <h2 className="form-title">Restablecer contraseña</h2>
          <p className="form-subtitle">
            Crea una nueva contraseña robusta para proteger tus operaciones en el sistema.
          </p>

          {!token ? (
            <div className="alert alert-warning py-4 text-center my-4 border rounded-3 bg-white shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2 text-warning"></i>
              <h5 className="fw-bold mb-1">Enlace inválido o incompleto</h5>
              <p className="small text-muted mb-3">
                No se detectó el token de seguridad en la URL o el enlace está truncado.
              </p>
              <Link to="/auth/recuperar-password" className="btn btn-primary btn-sm px-4">
                Solicitar nuevo enlace
              </Link>
            </div>
          ) : exito ? (
            <div className="text-center py-4 px-3 my-4 bg-white rounded-4 shadow-sm border">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3"
                style={{ width: '70px', height: '70px', fontSize: '32px' }}
              >
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h4 className="fw-bold text-dark mb-2">¡Contraseña Actualizada!</h4>
              <p className="text-muted small mb-4">
                Tu clave ha sido actualizada con éxito y tus sesiones previas han sido cerradas por seguridad.
              </p>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span className="small text-muted">Redirigiendo a la pantalla de login...</span>
              </div>
              <Link to="/auth/login" className="btn btn-primary btn-sm px-4">
                Ir al Login ahora
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center my-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                  <div>{error}</div>
                </div>
              )}

              <form className="login-form mt-4" onSubmit={handleSubmit}>
                {/* Campo 1: Nueva Contraseña */}
                <div className="mb-3">
                  <label className="form-label-auth" htmlFor="passInput">Nueva Contraseña</label>
                  <div className="field-wrap">
                    <i className="bi bi-lock"></i>
                    <input
                      id="passInput"
                      type={showPass1 ? 'text' : 'password'}
                      required
                      placeholder="Ingresa tu nueva contraseña"
                      className="form-control-auth"
                      value={nuevaPassword}
                      disabled={loading}
                      onChange={(e) => {
                        setNuevaPassword(e.target.value);
                        if (error) setError(null);
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPass1(!showPass1)}
                      aria-label="Mostrar u ocultar contraseña"
                    >
                      <i className={`bi ${showPass1 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Barra medidora de fortaleza */}
                {nuevaPassword.length > 0 && (
                  <div className="mb-3 p-3 bg-white border rounded-3 shadow-xs">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Fortaleza de contraseña:</small>
                      <span className={`badge ${strengthScore === 5 ? 'bg-success' : strengthScore >= 3 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {strengthLabel.text}
                      </span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar ${strengthLabel.color} progress-bar-striped progress-bar-animated`}
                        role="progressbar"
                        style={{ width: strengthLabel.width }}
                        aria-valuenow={strengthScore * 20}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>

                    {/* Requisitos visuales en tiempo real */}
                    <div className="mt-3 small">
                      <div className="fw-semibold text-dark mb-2">Requisitos de seguridad obligatorios:</div>
                      <div className="row g-1">
                        <div className="col-12 col-sm-6">
                          <span className={securityRules.hasMinLength ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`bi ${securityRules.hasMinLength ? 'bi-check-circle-fill text-success' : 'bi-circle'} me-1`}></i>
                            Mínimo 8 caracteres
                          </span>
                        </div>
                        <div className="col-12 col-sm-6">
                          <span className={securityRules.hasUpper ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`bi ${securityRules.hasUpper ? 'bi-check-circle-fill text-success' : 'bi-circle'} me-1`}></i>
                            Una mayúscula (A-Z)
                          </span>
                        </div>
                        <div className="col-12 col-sm-6">
                          <span className={securityRules.hasLower ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`bi ${securityRules.hasLower ? 'bi-check-circle-fill text-success' : 'bi-circle'} me-1`}></i>
                            Una minúscula (a-z)
                          </span>
                        </div>
                        <div className="col-12 col-sm-6">
                          <span className={securityRules.hasNumber ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`bi ${securityRules.hasNumber ? 'bi-check-circle-fill text-success' : 'bi-circle'} me-1`}></i>
                            Al menos un número (0-9)
                          </span>
                        </div>
                        <div className="col-12">
                          <span className={securityRules.hasSymbol ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`bi ${securityRules.hasSymbol ? 'bi-check-circle-fill text-success' : 'bi-circle'} me-1`}></i>
                            Un símbolo especial (!@#$%...)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Campo 2: Confirmar Contraseña */}
                <div className="mb-3">
                  <label className="form-label-auth" htmlFor="confirmPassInput">Confirmar Contraseña</label>
                  <div className="field-wrap">
                    <i className="bi bi-shield-lock"></i>
                    <input
                      id="confirmPassInput"
                      type={showPass2 ? 'text' : 'password'}
                      required
                      placeholder="Repite la contraseña"
                      className="form-control-auth"
                      value={confirmarPassword}
                      disabled={loading}
                      onChange={(e) => {
                        setConfirmarPassword(e.target.value);
                        if (error) setError(null);
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPass2(!showPass2)}
                      aria-label="Mostrar u ocultar confirmación de contraseña"
                    >
                      <i className={`bi ${showPass2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {confirmarPassword.length > 0 && (
                    <div className="mt-1 small">
                      {passwordsMatch ? (
                        <span className="text-success fw-medium">
                          <i className="bi bi-check-circle-fill me-1"></i>Las contraseñas coinciden
                        </span>
                      ) : (
                        <span className="text-danger fw-medium">
                          <i className="bi bi-x-circle-fill me-1"></i>Las contraseñas no coinciden
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Campo Condicional: 2FA */}
                {requiereTotp && (
                  <div className="mb-4 p-3 bg-white border border-warning rounded-3 shadow-xs">
                    <label className="form-label-auth text-dark" htmlFor="totpInput">
                      <i className="bi bi-phone-fill me-1 text-primary"></i>
                      Código de Google Authenticator (2FA Requerido)
                    </label>
                    <div className="field-wrap">
                      <i className="bi bi-key"></i>
                      <input
                        id="totpInput"
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="123456"
                        className="form-control-auth text-center fw-bold fs-5 letter-spacing"
                        value={codigoTotp}
                        disabled={loading}
                        onChange={(e) => setCodigoTotp(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div className="small text-muted mt-2">
                      Tu cuenta tiene 2FA activo. Ingresa los 6 dígitos de tu app móvil para autorizar el cambio.
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-login mt-2"
                  disabled={loading || (nuevaPassword.length > 0 && (!isPasswordSecure || !passwordsMatch))}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Guardando cambios...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      <span>Actualizar Contraseña</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-4">
            <Link to="/auth/login" className="helper-link">
              <i className="bi bi-arrow-left me-1"></i>
              Volver al inicio de sesión
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
