import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: '#f0f4f8' }}>
      {/* Navbar con estilo corporativo original */}
      <nav className="navbar navbar-expand-md px-3 px-md-4 py-3" style={{ background: '#0f2442' }}>
        <div className="container-fluid px-lg-5">
          <Link to="/" className="navbar-brand text-white fw-bold d-flex align-items-center gap-2 fs-5 text-decoration-none">
            <span style={{ fontSize: '20px' }}>📦</span>
            <span>CargaExpress <span style={{ color: '#fc8181' }}>Perú</span></span>
          </Link>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <Link
              to="/registrar-pedido"
              className="btn btn-outline-light btn-sm fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 text-nowrap"
              style={{ fontSize: '13px' }}
            >
              <i className="bi bi-box-arrow-up-right"></i>
              <span>Registrar Pedido</span>
            </Link>
            <Link
              to="/auth/login"
              className="btn btn-light btn-sm fw-bold d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 text-dark text-nowrap"
              style={{ fontSize: '13px' }}
            >
              <i className="bi bi-lock-fill"></i>
              <span>Ingresar</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido Dinámico */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer corporativo original */}
      <footer style={{ background: '#0f2442', color: 'rgba(255,255,255,0.6)' }} className="py-4 mt-auto border-top border-secondary">
        <div className="container text-center text-md-start">
          <div className="row align-items-center gy-3">
            <div className="col-md-6">
              <strong className="text-white d-flex align-items-center justify-content-center justify-content-md-start gap-1">
                <span>📦</span> CargaExpress Perú S.A.C.
              </strong>
              <div className="small mt-1 text-white-50">
                RUC: 20100227461 | Lima, Perú
              </div>
            </div>
            <div className="col-md-6 text-md-end small">
              <a href="#" className="text-white-50 text-decoration-none hover-white">Términos y Condiciones</a>
              <span className="mx-2 text-white-50">|</span>
              <a href="#" className="text-white-50 text-decoration-none hover-white">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
