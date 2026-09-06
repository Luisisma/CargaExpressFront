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
      title: 'Operaciones',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'bi-grid-fill' },
        { name: 'Envíos / Encomiendas', path: '/admin/envios', icon: 'bi-box-seam-fill' },
        { name: 'Caja y Arqueos', path: '/admin/caja', icon: 'bi-cash-coin' },
        { name: 'Almacén de Agencia', path: '/admin/almacen', icon: 'bi-archive-fill' },
      ]
    },
    {
      title: 'Transporte y Guías',
      items: [
        { name: 'Guías de Remisión', path: '/admin/guias', icon: 'bi-file-earmark-text-fill' },
        { name: 'Manifiestos de Carga', path: '/admin/manifiestos', icon: 'bi-truck' },
        { name: 'Courier y Entregas', path: '/admin/courier', icon: 'bi-bicycle' },
      ]
    },
    {
      title: 'Gestión',
      items: [
        { name: 'Directorio Agencias', path: '/admin/agencias', icon: 'bi-building-fill' },
        { name: 'Cartera Clientes', path: '/admin/clientes', icon: 'bi-people-fill' },
        { name: 'Usuarios del Sistema', path: '/admin/usuarios', icon: 'bi-person-badge-fill' },
      ]
    }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar estilo original CargaExpress */}
      <aside
        className={`sidebar ${sidebarOpen ? 'd-flex' : 'd-none d-md-flex'}`}
        style={{ width: '260px' }}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="bi bi-box-seam-fill"></i>
          </div>
          <div className="brand-text">
            CargaExpress
            <small>SISTEMA DE ENCOMIENDAS</small>
          </div>
          <button
            className="btn btn-sm text-white ms-auto d-md-none"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* User Card */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.nombre?.charAt(0) || 'A'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.nombre || 'Administrador'}</div>
            <div className="user-role">{user?.rol || 'ADMIN'} • {user?.agencia || 'LIMA'}</div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="sidebar-nav">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <div className="nav-section-title">{sec.title}</div>
              <ul className="list-unstyled mb-2">
                {sec.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <li className="nav-item" key={item.path}>
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

        {/* Role Switcher */}
        <div className="px-3 py-2 border-top border-secondary bg-dark bg-opacity-50">
          <label className="text-secondary small d-block mb-1" style={{ fontSize: '11px' }}>
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

        {/* Logout Footer */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper flex-grow-1">
        {/* Topbar */}
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-light border d-md-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <div className="topbar-title">
              Panel Operativo Nacional
            </div>
          </div>

          <div className="topbar-actions">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
              <i className="bi bi-geo-alt-fill me-1"></i> {user?.agencia || 'Sede Principal Lima'}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
