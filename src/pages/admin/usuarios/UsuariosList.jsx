import React from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';

export default function UsuariosList() {
  const usuarios = [
    { id: 1, nombre: 'Administrador General', email: 'admin@cargaexpress.pe', rol: 'Administrador', agencia: 'Sede Central Lima' },
    { id: 2, nombre: 'Roberto Soto', email: 'cajero.lima@cargaexpress.pe', rol: 'Cajero', agencia: 'Sede Central Lima' },
    { id: 3, nombre: 'Miguel Prado', email: 'almacen.aqp@cargaexpress.pe', rol: 'Almacén', agencia: 'Arequipa Industrial' },
    { id: 4, nombre: 'Javier Quispe', email: 'courier.01@cargaexpress.pe', rol: 'Courier', agencia: 'Sede Central Lima' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Personal y Colaboradores</h3>
          <p className="text-secondary small mb-0">Gestión de usuarios y asignación de roles operativos</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Agencia Asignada</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.nombre}</strong></td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-brand-primary text-white">{u.rol}</span></td>
                  <td>{u.agencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
