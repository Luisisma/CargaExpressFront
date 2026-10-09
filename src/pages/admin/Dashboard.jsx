import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';

/**
 * Dashboard Administrativo - CargaExpress Perú S.A.C.
 * Conectado 100% a la API REST FastAPI (/api/v1/dashboard/resumen)
 */
export default function Dashboard() {
  const { user } = useAuth();

  const [fechaHoy, setFechaHoy] = useState('Cargando fecha...');
  const [stats, setStats] = useState({
    envios_total: 0,
    envios_hoy: 0,
    ingresos_hoy: 0,
    pendientes_pago: 0
  });
  const [ultimosEnvios, setUltimosEnvios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await dashboardService.getResumen();
      if (data) {
        setStats(data.stats || { envios_total: 0, envios_hoy: 0, ingresos_hoy: 0, pendientes_pago: 0 });
        setUltimosEnvios(data.ultimos_envios || []);
        setFechaHoy(data.fecha_hoy || 'Hoy');
      }
    } catch (err) {
      setError(err.message || 'No se pudieron sincronizar las métricas con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const getBadgeClass = (estado) => {
    const e = (estado || '').toLowerCase();
    if (e.includes('entregado')) return 'badge bg-success';
    if (e.includes('transito')) return 'badge bg-info text-dark';
    if (e.includes('almacen')) return 'badge bg-warning text-dark';
    return 'badge bg-secondary';
  };


  const rolActual = (user?.tipo || user?.rol || 'administrador').toLowerCase();
  const nombreDisplay = user?.nombres 
    ? user.nombres.split(' ')[0] 
    : (user?.nombre_completo 
        ? user.nombre_completo.split(' ')[0] 
        : (user?.nombre ? user.nombre.split(' ')[0] : 'Colaborador'));

  return (
    <div className="page-shell">
      {/* Encabezado Principal */}
      <div className="page-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div className="page-title-group">
          <div className="page-icon">
            <i className="bi bi-grid-1x2-fill"></i>
          </div>
          <div>
            <h1 className="page-heading">
              Buen día, {nombreDisplay}
            </h1>
            <p className="page-subtitle">
              <span className="text-uppercase fw-semibold text-primary">{user?.tipo || user?.rol || 'COLABORADOR'}</span> · {fechaHoy}
            </p>
          </div>
        </div>

        <div className="page-actions w-100 w-sm-auto">
          {rolActual === 'almacen' ? (
            <Link
              to="/admin/almacen/despacho"
              className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-3"
            >
              <i className="bi bi-truck"></i>
              <span>Despacho a Ruta</span>
            </Link>
          ) : rolActual === 'cajero' ? (
            <Link
              to="/admin/caja/recepcion"
              className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-3"
            >
              <i className="bi bi-box-seam"></i>
              <span>Recepción (Mostrador)</span>
            </Link>
          ) : rolActual === 'courier' ? (
            <Link
              to="/admin/courier"
              className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-3"
            >
              <i className="bi bi-bicycle"></i>
              <span>Mis Entregas</span>
            </Link>
          ) : (
            <Link
              to="/registrar-pedido"
              className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-3"
            >
              <i className="bi bi-plus-circle"></i>
              <span>Registrar Envío</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Tarjetas de Métricas (KPIs) - Adaptadas por Rol (Almacén vs Finanzas) */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="metric-card">
            <div className="metric-icon blue">
              <i className="bi bi-box-seam-fill"></i>
            </div>
            <div>
              <div className="metric-value">{stats.envios_total}</div>
              <div className="metric-label">Total Envíos</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="metric-card">
            <div className="metric-icon green">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
            <div>
              <div className="metric-value">{stats.envios_hoy}</div>
              <div className="metric-label">Envíos Hoy</div>
            </div>
          </div>
        </div>

        {rolActual === 'almacen' ? (
          <>
            <div className="col-6 col-md-3">
              <div className="metric-card">
                <div className="metric-icon blue">
                  <i className="bi bi-truck"></i>
                </div>
                <div>
                  <div className="metric-value text-primary fs-5 fw-bold">Despacho</div>
                  <div className="metric-label">Módulo Camiones</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="metric-card">
                <div className="metric-icon green">
                  <i className="bi bi-box-arrow-in-down"></i>
                </div>
                <div>
                  <div className="metric-value text-success fs-5 fw-bold">Arribos</div>
                  <div className="metric-label">Descarga Bodega</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-6 col-md-3">
              <div className="metric-card">
                <div className="metric-icon red">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <div>
                  <div className="metric-value">S/{stats.ingresos_hoy}</div>
                  <div className="metric-label">Ingresos Hoy</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="metric-card">
                <div className="metric-icon red">
                  <i className="bi bi-credit-card-2-front-fill"></i>
                </div>
                <div>
                  <div className="metric-value">{stats.pendientes_pago}</div>
                  <div className="metric-label">Pendientes de Pago</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sección Inferior: Tabla de Envíos (8 cols) + Acciones Rápidas (4 cols) */}
      <div className="row g-4">
        {/* Últimos Envíos */}
        <div className="col-12 col-lg-8">
          <div className="data-card">
            <div className="data-card-header">
              <h2 className="data-card-title d-flex align-items-center gap-2">
                <i className="bi bi-list-ul"></i>
                <span>Últimos Envíos</span>
              </h2>
              <Link to="/admin/envios" className="btn btn-sm btn-outline-primary fw-semibold px-3 rounded-pill">
                Ver todos
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover data-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Tracking</th>
                    <th>Remitente</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Cargando últimos despachos...
                      </td>
                    </tr>
                  ) : ultimosEnvios.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No hay encomiendas registradas aún.
                      </td>
                    </tr>
                  ) : (
                    ultimosEnvios.map((e) => (
                      <tr key={e.id}>
                        <td>
                          <code className="text-primary fw-semibold" style={{ fontSize: '13px' }}>
                            {e.codigo_tracking}
                          </code>
                        </td>
                        <td className="text-dark" style={{ fontSize: '13px' }}>{e.remitente}</td>
                        <td className="text-secondary" style={{ fontSize: '13px' }}>{e.destino}</td>
                        <td>
                          <span className={getBadgeClass(e.estado)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}>
                            {e.estado}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted" style={{ fontSize: '12px' }}>{e.fecha}</small>
                        </td>
                        <td>
                          <div className="action-group d-flex justify-content-end">
                            <Link
                              to={`/admin/envios/${e.id}`}
                              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px', padding: 0 }}
                              title="Ver detalle"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel Lateral: Acciones Rápidas */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h2 className="data-card-title mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-lightning-fill text-warning"></i>
                <span>Acciones Rápidas</span>
              </h2>
              <div className="d-flex flex-column gap-2">
                {rolActual === 'almacen' ? (
                  <>
                    <Link
                      to="/admin/almacen/despacho"
                      className="btn btn-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3 shadow-sm"
                    >
                      <i className="bi bi-truck me-2"></i>
                      <span>Despacho a Ruta (Camiones)</span>
                    </Link>

                    <Link
                      to="/admin/almacen/arribos"
                      className="btn btn-outline-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-box-arrow-in-down me-2"></i>
                      <span>Arribos (Descarga Bodega)</span>
                    </Link>

                    <Link
                      to="/admin/guias"
                      className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      <span>Guías de Remisión</span>
                    </Link>

                    <Link
                      to="/admin/manifiestos"
                      className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-folder2 me-2"></i>
                      <span>Manifiestos de Carga</span>
                    </Link>
                  </>
                ) : rolActual === 'cajero' ? (
                  <>
                    <Link
                      to="/admin/caja/recepcion"
                      className="btn btn-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3 shadow-sm"
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      <span>Recepción en Ventanilla</span>
                    </Link>

                    <Link
                      to="/registrar-pedido"
                      className="btn btn-outline-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      <span>Nuevo Envío (Mostrador)</span>
                    </Link>

                    <Link
                      to="/admin/caja"
                      className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-wallet2 me-2"></i>
                      <span>Arqueo y Cierre de Caja</span>
                    </Link>

                    <Link
                      to="/admin/envios"
                      className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-list-ul me-2"></i>
                      <span>Mis Envíos de Sede</span>
                    </Link>
                  </>
                ) : rolActual === 'courier' || rolActual === 'transportista' ? (
                  <>
                    <Link
                      to="/admin/courier"
                      className="btn btn-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3 shadow-sm"
                    >
                      <i className="bi bi-bicycle me-2"></i>
                      <span>Mis Entregas Asignadas</span>
                    </Link>

                    <Link
                      to="/admin/envios"
                      className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-search me-2"></i>
                      <span>Consultar Envíos y Guías</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/registrar-pedido"
                      className="btn btn-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3 shadow-sm"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      <span>Registrar Envío</span>
                    </Link>

                    <Link
                      to="/admin/guias"
                      className="btn btn-outline-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-file-earmark-plus me-2"></i>
                      <span>Generar Guías</span>
                    </Link>

                    <Link
                      to="/admin/manifiestos"
                      className="btn btn-outline-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-clipboard2-plus me-2"></i>
                      <span>Generar Manifiestos</span>
                    </Link>

                    <Link
                      to="/admin/usuarios"
                      className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
                    >
                      <i className="bi bi-people me-2"></i>
                      <span>Gestionar Personal y Usuarios</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


