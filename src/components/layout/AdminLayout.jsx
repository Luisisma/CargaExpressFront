import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navSections = [
    {
      title: '',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'bi-grid-fill' },
      ]
    },
    {
      title: 'OPERACIONES',
      items: [
        { name: 'Nuevo Envío', path: '/registrar-pedido', icon: 'bi-plus-square' },
        { name: 'Mis Envíos', path: '/admin/envios', icon: 'bi-list-ul' },
      ]
    },
    {
      title: 'CAJA',
      items: [
        { name: 'Apertura de Caja', path: '/admin/caja', icon: 'bi-lock' },
        { name: 'Cierre de Caja', path: '/admin/caja', icon: 'bi-wallet2' },
      ]
    },
    {
      title: 'LOGÍSTICA',
      items: [
        { name: 'Almacén', path: '/admin/almacen', icon: 'bi-building' },
        { name: 'Guías de Remisión', path: '/admin/guias', icon: 'bi-file-earmark-text' },
        { name: 'Manifiestos', path: '/admin/manifiestos', icon: 'bi-folder2' },
        { name: 'Transportistas', path: '/admin/manifiestos', icon: 'bi-truck' },
      ]
    },
    {
      title: 'ENTREGAS',
      items: [
        { name: 'Mis Entregas', path: '/admin/courier', icon: 'bi-bicycle' },
      ]
    }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Overlay para móviles cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar idéntico a la captura */}
      <aside
        className={`sidebar ${sidebarOpen ? 'd-flex' : 'd-none d-md-flex'}`}
      >
        {/* Brand */}
        <div className="sidebar-brand d-flex align-items-center gap-2 py-3 px-3">
          <div
            className="brand-icon rounded-3 d-flex align-items-center justify-content-center text-white"
            style={{ width: '34px', height: '34px', background: '#e53e3e', fontSize: '18px' }}
          >
            📦
          </div>
          <div className="brand-text text-white lh-1">
            <span className="fw-bold fs-6 d-block">CargaExpress</span>
            <small className="text-white-50" style={{ fontSize: '10px' }}>Perú S.A.C.</small>
          </div>
          <button
            className="btn btn-sm text-white ms-auto d-md-none"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* User Card */}
        <div className="sidebar-user px-3 py-2 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
            style={{ width: '34px', height: '34px', background: '#2b6cb0', fontSize: '12px' }}
          >
            AC
          </div>
          <div className="user-info text-truncate">
            <div className="user-name text-white fw-bold small text-truncate">{user?.nombre || 'Administrador'}</div>
            <div className="user-role text-white-50 text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
              {user?.rol || 'ADMINISTRADOR'}
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="sidebar-nav px-2 py-3">
          {navSections.map((sec, idx) => (
            <div key={idx} className="mb-2">
              {sec.title && (
                <div
                  className="nav-section-title px-2 mb-1 text-white-50 fw-bold"
                  style={{ fontSize: '10px', letterSpacing: '0.8px' }}
                >
                  {sec.title}
                </div>
              )}
              <ul className="list-unstyled mb-0">
                {sec.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li className="nav-item mb-1" key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={isActive ? 'active' : ''}
                      >
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Role Switcher (Simulación) */}
        <div className="px-3 py-2 border-top border-secondary border-opacity-25 bg-dark bg-opacity-25">
          <label className="text-white-50 small d-block mb-1" style={{ fontSize: '11px' }}>
            Simular Rol:
          </label>
          <select
            value={user?.rol || 'administrador'}
            onChange={(e) => switchRole(e.target.value)}
            className="form-select form-select-sm bg-dark text-white border-secondary"
            style={{ fontSize: '12px' }}
          >
            <option value="administrador">Administrador</option>
            <option value="cajero">Cajero</option>
            <option value="almacen">Almacén</option>
            <option value="courier">Courier</option>
          </select>
        </div>

        {/* Logout Footer - Idéntico al monolito original */}
        <div className="sidebar-footer">
          <div className="nav-item">
            <button
              onClick={handleLogout}
              className="btn btn-link w-100 text-start p-0 text-decoration-none d-flex align-items-center gap-2"
              style={{ color: 'rgba(255, 100, 100, 0.85)', fontSize: '13px', padding: '9px 10px' }}
            >
              <i className="bi bi-box-arrow-left fs-6"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>


      {/* Main Wrapper */}
      <div className="main-wrapper flex-grow-1" style={{ minWidth: 0 }}>
        {/* Topbar idéntico a la captura */}
        <header className="topbar px-3 px-md-4 py-2 d-flex align-items-center justify-content-between bg-white border-bottom sticky-top">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-light border d-md-none p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <h5 className="fw-bold text-dark mb-0 fs-6">Dashboard</h5>
          </div>

          <div className="topbar-actions">
            <Link
              to="/"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1"
              style={{ fontSize: '12px' }}
            >
              <i className="bi bi-globe"></i>
              <span>Sitio Público</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
