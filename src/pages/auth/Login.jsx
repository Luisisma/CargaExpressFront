import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [dni, setDni] = useState('00000001');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(dni, password);
    navigate('/auth/2fa');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
      <div className="card border-0 shadow rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-brand-primary text-white p-3 rounded-circle d-inline-flex mb-3">
            <Lock size={32} />
          </div>
          <h3 className="fw-bold text-dark">Portal Colaborador</h3>
          <p className="text-secondary small">Ingresa tus credenciales autorizadas de CargaExpress</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Documento de Identidad (DNI)</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><User size={18} /></span>
              <input
                type="text"
                maxLength={8}
                required
                className="form-control"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><Lock size={18} /></span>
              <input
                type="password"
                required
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-brand w-100 py-2 rounded-3 fw-bold">
            Continuar a Verificación 2FA
          </button>
        </form>
      </div>
    </div>
  );
}
