import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, Warehouse, Truck, Users, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const cards = [
    { title: 'Envíos del Día', val: '142', icon: Package, color: 'text-primary', link: '/admin/envios' },
    { title: 'Ingresos en Caja', val: 'S/ 5,420.00', icon: DollarSign, color: 'text-success', link: '/admin/caja' },
    { title: 'Stock en Almacén', val: '68 bultos', icon: Warehouse, color: 'text-warning', link: '/admin/almacen' },
    { title: 'Manifiestos en Ruta', val: '7 camiones', icon: Truck, color: 'text-info', link: '/admin/manifiestos' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Tablero de Control Operativo</h3>
          <p className="text-secondary small mb-0">Resumen y estado general de la sede actual</p>
        </div>
        <Link to="/admin/envios" className="btn btn-brand rounded-3 fw-semibold d-flex align-items-center gap-2">
          <Package size={18} />
          <span>Gestionar Envíos</span>
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div className="col-sm-6 col-xl-3" key={i}>
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-secondary small fw-semibold">{c.title}</span>
                    <h3 className="fw-bold text-dark my-2">{c.val}</h3>
                  </div>
                  <div className={`p-2 rounded-3 bg-light ${c.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <Link to={c.link} className="small text-decoration-none text-brand-secondary fw-semibold mt-auto pt-2 d-flex align-items-center gap-1">
                  <span>Ver detalle</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold text-dark mb-3">Últimas Encomiendas Procesadas</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Código Tracking</th>
                <th>Remitente</th>
                <th>Destino</th>
                <th>Peso</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong className="text-brand-primary">CE2026070001</strong></td>
                <td>Juan Pérez (41238902)</td>
                <td>Arequipa Industrial</td>
                <td>4.5 kg</td>
                <td>S/ 32.50</td>
                <td><span className="badge bg-info text-dark">EN TRÁNSITO</span></td>
              </tr>
              <tr>
                <td><strong className="text-brand-primary">CE2026070002</strong></td>
                <td>María Gómez (70891234)</td>
                <td>Trujillo Centro</td>
                <td>12.0 kg</td>
                <td>S/ 68.00</td>
                <td><span className="badge bg-warning text-dark">EN ALMACÉN</span></td>
              </tr>
              <tr>
                <td><strong className="text-brand-primary">CE2026070003</strong></td>
                <td>Carlos Ramos (10892345)</td>
                <td>Chiclayo Terminal</td>
                <td>2.0 kg</td>
                <td>S/ 22.00</td>
                <td><span className="badge bg-success">ENTREGADO</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
