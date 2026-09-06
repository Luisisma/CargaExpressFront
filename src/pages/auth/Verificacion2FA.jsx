import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Verificacion2FA() {
  const [token, setToken] = useState('123456');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
      <div className="card border-0 shadow rounded-4 p-4 p-md-5 bg-white text-center" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="bg-brand-primary text-white p-3 rounded-circle d-inline-flex mb-3 mx-auto">
          <ShieldCheck size={36} />
        </div>
        <h3 className="fw-bold text-dark">Doble Factor (2FA)</h3>
        <p className="text-secondary small">Ingresa el código temporal TOTP de 6 dígitos generado en tu aplicación autenticadora.</p>

        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <input
              type="text"
              maxLength={6}
              required
              className="form-control form-control-lg text-center fw-bold fs-3 tracking-widest"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-brand w-100 py-2 rounded-3 fw-bold mb-3">
            Acceder al Panel
          </button>

          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="btn btn-link text-secondary text-decoration-none small d-inline-flex align-items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span>Volver a ingresar credenciales</span>
          </button>
        </form>
      </div>
    </div>
  );
}
