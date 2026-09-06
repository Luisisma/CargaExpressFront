import React from 'react';
import { Building, MapPin, Phone } from 'lucide-react';

export default function AgenciasList() {
  const agencias = [
    { id: 1, nombre: 'Lima - Sede Central San Miguel', ciudad: 'Lima', direccion: 'Av. La Marina 2100', telefono: '01-456-7890' },
    { id: 2, nombre: 'Arequipa - Parque Industrial', ciudad: 'Arequipa', direccion: 'Av. Industrial 502', telefono: '054-223344' },
    { id: 3, nombre: 'Trujillo - Centro Histórico', ciudad: 'La Libertad', direccion: 'Jr. Pizarro 340', telefono: '044-889900' },
    { id: 4, nombre: 'Chiclayo - Terminal Balta', ciudad: 'Lambayeque', direccion: 'Av. Balta 1012', telefono: '074-332211' },
    { id: 5, nombre: 'Cusco - Terminal Terrestre', ciudad: 'Cusco', direccion: 'Vía de Evitamiento 410', telefono: '084-554433' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Directorio Nacional de Agencias</h3>
          <p className="text-secondary small mb-0">Red de 52 agencias CargaExpress conectadas</p>
        </div>
      </div>

      <div className="row g-3">
        {agencias.map((a) => (
          <div className="col-md-6 col-lg-4" key={a.id}>
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Building size={20} className="text-brand-secondary" />
                <h6 className="fw-bold text-dark mb-0">{a.nombre}</h6>
              </div>
              <div className="small text-secondary mb-1 d-flex align-items-center gap-1">
                <MapPin size={16} />
                <span>{a.direccion} ({a.ciudad})</span>
              </div>
              <div className="small text-muted d-flex align-items-center gap-1 mt-auto pt-2">
                <Phone size={16} />
                <span>{a.telefono}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
