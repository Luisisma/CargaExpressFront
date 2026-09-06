import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard Administrativo - CargaExpress Perú S.A.C.
 * 
 * NOTA DE MIGRACIÓN:
 * Los datos mostrados (estadísticas, últimos envíos) corresponden a mocks visuales 
 * de alta fidelidad que replican exactamente la vista del monolito Flask/Jinja2.
 * En la siguiente fase (Fase 2 - Backend FastAPI), estas variables se consumirán
 * mediante llamadas reactivas a la API REST /api/v1/dashboard/stats y /api/v1/envios.
 */
export default function Dashboard() {
  const { user } = useAuth();

  // Fecha simulada formateada al estándar de la vista original
  const fechaHoy = 'domingo 06 de septiembre, 2026';

  // KPIs idénticos a la vista original
  const stats = {
    envios_total: 6,
    envios_hoy: 0,
    ingresos_hoy: 0,
    pendientes_pago: 2
  };

  // Últimos envíos extraídos con exactitud de la captura del sistema
  const ultimosEnvios = [
    {
      id: 1,
      codigo_tracking: 'CESEKB8H3P0D',
      remitente: 'LUIS HUMBERTO MORALES ME',
      destino: 'AGENCIA CAJAMARCA - CAJAMARCA',
      estado: 'Registrado',
      badgeClass: 'badge bg-secondary',
      fecha: '30/08 22:34'
    },
    {
      id: 2,
      codigo_tracking: 'CE44RHOEDYWK',
      remitente: 'MARTIN ARTURO SANCHEZ ME',
      destino: 'AGENCIA APURÍMAC - ANDAHUAYLAS',
      estado: 'Entregado',
      badgeClass: 'badge bg-success',
      fecha: '16/07 02:03'
    },
    {
      id: 3,
      codigo_tracking: 'CEBU6UEUU0S8',
      remitente: 'CA SOLUTIONS S.A.C.',
      destino: 'AGENCIA LIMA - JAVIER PRADO',
      estado: 'En Tránsito',
      badgeClass: 'badge bg-warning text-dark',
      fecha: '11/07 16:15'
    },
    {
      id: 4,
      codigo_tracking: 'CE1AV4U79P70',
      remitente: 'MOISES CHINGUEL CULQUI',
      destino: 'AGENCIA AREQUIPA - PLAZA DE ARMAS',
      estado: 'Entregado',
      badgeClass: 'badge bg-success',
      fecha: '01/07 23:11'
    },
    {
      id: 5,
      codigo_tracking: 'CE94PSLQ8R6S',
      remitente: 'Cliente Prueba Postman',
      destino: 'AGENCIA AREQUIPA - PLAZA DE ARMAS',
      estado: 'Registrado',
      badgeClass: 'badge bg-secondary',
      fecha: '01/07 21:51'
    },
    {
      id: 6,
      codigo_tracking: 'CEU177DRNQGU',
      remitente: 'DEPLOY-VALIDATION-070110',
      destino: 'AGENCIA AREQUIPA - PLAZA DE ARMAS',
      estado: 'Entregado',
      badgeClass: 'badge bg-success',
      fecha: '01/07 10:01'
    }
  ];

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
              Buen día, {user?.nombre ? user.nombre.split(' ')[0] : 'Administrador'}
            </h1>
            <p className="page-subtitle">
              <span className="text-capitalize">{user?.rol || 'Administrador'}</span> · {fechaHoy}
            </p>
          </div>
        </div>

        <div className="page-actions w-100 w-sm-auto">
          <Link
            to="/registrar-pedido"
            className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-3"
          >
            <i className="bi bi-plus-circle"></i>
            <span>Registrar Envío</span>
          </Link>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas (KPIs) - Responsivas (2 cols en celular, 4 en desktop) */}
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
                  {ultimosEnvios.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <code className="text-primary fw-semibold" style={{ fontSize: '13px' }}>
                          {e.codigo_tracking}
                        </code>
                      </td>
                      <td className="text-dark" style={{ fontSize: '13px' }}>{e.remitente}</td>
                      <td className="text-secondary" style={{ fontSize: '13px' }}>{e.destino}</td>
                      <td>
                        <span className={e.badgeClass} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}>
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
                  ))}
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
                <Link
                  to="/registrar-pedido"
                  className="btn btn-primary btn-sm py-2 px-3 fw-semibold text-start d-flex align-items-center rounded-3"
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
                  <span>Gestionar Usuarios</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


