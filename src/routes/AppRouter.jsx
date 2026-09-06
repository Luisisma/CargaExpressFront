import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Vistas Públicas
import Home from '../pages/public/Home';
import Cotizador from '../pages/public/Cotizador';
import RegistrarPedido from '../pages/public/RegistrarPedido';
import PedidoExitoso from '../pages/public/PedidoExitoso';
import Tracking from '../pages/public/Tracking';

// Vistas de Autenticación
import Login from '../pages/auth/Login';
import Verificacion2FA from '../pages/auth/Verificacion2FA';

// Vistas Administrativas
import Dashboard from '../pages/admin/Dashboard';
import EnviosList from '../pages/admin/envios/EnviosList';
import EnvioDetalle from '../pages/admin/envios/EnvioDetalle';
import AgenciasList from '../pages/admin/agencias/AgenciasList';
import ClientesList from '../pages/admin/clientes/ClientesList';
import CajaDashboard from '../pages/admin/caja/CajaDashboard';
import AlmacenStock from '../pages/admin/almacen/AlmacenStock';
import GuiasList from '../pages/admin/guias/GuiasList';
import ManifiestosList from '../pages/admin/manifiestos/ManifiestosList';
import CourierRepartos from '../pages/admin/courier/CourierRepartos';
import UsuariosList from '../pages/admin/usuarios/UsuariosList';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cotizar" element={<Cotizador />} />
          <Route path="/registrar-pedido" element={<RegistrarPedido />} />
          <Route path="/pedido-exitoso/:tracking" element={<PedidoExitoso />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:codigo" element={<Tracking />} />
        </Route>

        {/* Rutas de Autenticación */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/2fa" element={<Verificacion2FA />} />

        {/* Rutas Administrativas */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="envios" element={<EnviosList />} />
          <Route path="envios/:id" element={<EnvioDetalle />} />
          <Route path="agencias" element={<AgenciasList />} />
          <Route path="clientes" element={<ClientesList />} />
          <Route path="caja" element={<CajaDashboard />} />
          <Route path="almacen" element={<AlmacenStock />} />
          <Route path="guias" element={<GuiasList />} />
          <Route path="manifiestos" element={<ManifiestosList />} />
          <Route path="courier" element={<CourierRepartos />} />
          <Route path="usuarios" element={<UsuariosList />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
