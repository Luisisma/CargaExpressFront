import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

export default function Cotizador() {
  const [peso, setPeso] = useState(5);
  const [largo, setLargo] = useState(30);
  const [ancho, setAncho] = useState(20);
  const [alto, setAlto] = useState(20);

  // Fórmula corporativa: Peso volumétrico = (L * A * H) / 6000
  const pesoVolumetrico = ((largo * ancho * alto) / 6000).toFixed(2);
  const pesoCobrado = Math.max(peso, pesoVolumetrico);
  const costoEstimado = (15 + pesoCobrado * 3.5).toFixed(2);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-brand-primary text-white p-3 rounded-3">
              <Calculator size={28} />
            </div>
            <div>
              <h2 className="fw-bold text-dark mb-0">Cotizador de Envíos</h2>
              <p className="text-secondary small mb-0">Calcula al instante la tarifa según peso físico y volumétrico.</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold small text-secondary">Agencia Origen</label>
              <select className="form-select rounded-3 py-2">
                <option>Lima - Sede Central</option>
                <option>Arequipa - Parque Industrial</option>
                <option>Trujillo - Centro</option>
                <option>Chiclayo - Terminal</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small text-secondary">Agencia Destino</label>
              <select className="form-select rounded-3 py-2" defaultValue="Arequipa - Parque Industrial">
                <option>Arequipa - Parque Industrial</option>
                <option>Cusco - Terminal Terrestre</option>
                <option>Huancayo - El Tambo</option>
                <option>Piura - Los Tallanes</option>
              </select>
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-dark border-bottom pb-2">Dimensiones y Peso</h6>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-secondary">Peso Real (kg)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                className="form-control rounded-3"
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-secondary">Largo (cm)</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                value={largo}
                onChange={(e) => setLargo(Number(e.target.value))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-secondary">Ancho (cm)</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                value={ancho}
                onChange={(e) => setAncho(Number(e.target.value))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-secondary">Alto (cm)</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                value={alto}
                onChange={(e) => setAlto(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="p-4 bg-light rounded-4 border mt-4">
            <div className="row align-items-center">
              <div className="col-sm-7">
                <div className="small text-muted mb-1">Peso a facturar (máx real/volumétrico):</div>
                <div className="fw-bold text-dark fs-5">{pesoCobrado} kg</div>
                <div className="small text-secondary mt-1">Peso volumétrico: {pesoVolumetrico} kg</div>
              </div>
              <div className="col-sm-5 text-sm-end mt-3 mt-sm-0">
                <div className="small text-muted mb-1">Costo Estimado:</div>
                <div className="text-brand-secondary fw-bold fs-2">S/ {costoEstimado}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
