import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, ShieldCheck, Edit, Power, 
  Search, Building, Key, CheckCircle, AlertCircle, X, RefreshCw 
} from 'lucide-react';
import { usuarioService } from '../../../services/usuarioService';
import { publicService } from '../../../services/publicService';

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Modales
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modal2FA, setModal2FA] = useState(null);
  const [loading2FA, setLoading2FA] = useState(false);


  // Generador de contraseña segura que cumple las políticas del sistema
  const generarPasswordSegura = () => {
    const charsMayus = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const charsMinus = 'abcdefghijkmnopqrstuvwxyz';
    const charsNum = '23456789';
    const charsSym = '!@#$%&*';
    
    let pwd = '';
    pwd += charsMayus[Math.floor(Math.random() * charsMayus.length)];
    pwd += charsMinus[Math.floor(Math.random() * charsMinus.length)];
    pwd += charsMinus[Math.floor(Math.random() * charsMinus.length)];
    pwd += charsNum[Math.floor(Math.random() * charsNum.length)];
    pwd += charsSym[Math.floor(Math.random() * charsSym.length)];
    
    const all = charsMayus + charsMinus + charsNum + charsSym;
    for (let i = 0; i < 5; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }
    return pwd.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const validarPasswordSegura = (pwd) => {
    if (!pwd || pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir al menos una letra mayúscula (A-Z).';
    if (!/[a-z]/.test(pwd)) return 'Debe incluir al menos una letra minúscula (a-z).';
    if (!/\d/.test(pwd)) return 'Debe incluir al menos un número (0-9).';
    if (!/[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\/~`]/.test(pwd)) return 'Debe incluir al menos un símbolo especial (!@#$%...).';
    return null;
  };

  // Formulario Crear
  const [formCrear, setFormCrear] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: 'CargaExp#2026',
    tipo: 'cajero',
    agencia_id: '',
    numero_caja: '',
    licencia_conducir: ''
  });
  const [guardandoCrear, setGuardandoCrear] = useState(false);
  const [errorCrear, setErrorCrear] = useState('');
  const [reniecStatus, setReniecStatus] = useState({ cargando: false, mensaje: '', tipo: '' });

  // Consulta automática de DNI ante RENIEC para el Administrador
  const handleBuscarReniecAdmin = async () => {
    const dniLimpio = formCrear.dni.trim();
    if (dniLimpio.length !== 8) {
      setReniecStatus({ cargando: false, mensaje: 'Ingresa los 8 dígitos del DNI.', tipo: 'error' });
      return;
    }
    setReniecStatus({ cargando: true, mensaje: 'Consultando RENIEC...', tipo: 'info' });
    try {
      const res = await publicService.buscarCliente(dniLimpio);
      if (res && res.encontrado && res.nombre_completo) {
        const partes = res.nombre_completo.split(' ');
        let nombres = '';
        let apellidos = '';
        if (partes.length >= 3) {
          apellidos = partes.slice(-2).join(' ');
          nombres = partes.slice(0, -2).join(' ');
        } else if (partes.length === 2) {
          nombres = partes[0];
          apellidos = partes[1];
        } else {
          nombres = res.nombre_completo;
        }
        setFormCrear((prev) => ({
          ...prev,
          nombres: nombres || prev.nombres,
          apellidos: apellidos || prev.apellidos
        }));
        setReniecStatus({ cargando: false, mensaje: `✓ RENIEC: ${res.nombre_completo}`, tipo: 'ok' });
      } else {
        setReniecStatus({ cargando: false, mensaje: res?.mensaje || 'No se encontró en RENIEC. Completa manualmente.', tipo: 'warning' });
      }
    } catch (err) {
      setReniecStatus({ cargando: false, mensaje: 'No se pudo conectar a RENIEC. Completa manualmente.', tipo: 'error' });
    }
  };

  // Formulario Editar
  const [formEditar, setFormEditar] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    tipo: 'cajero',
    agencia_id: '',
    numero_caja: '',
    licencia_conducir: '',
    password: ''
  });

  const [guardandoEditar, setGuardandoEditar] = useState(false);
  const [errorEditar, setErrorEditar] = useState('');

  // Mensaje de éxito flotante
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');
      const [dataUsuarios, dataAgencias] = await Promise.all([
        usuarioService.getUsuarios(),
        publicService.getAgencias()
      ]);
      setUsuarios(dataUsuarios || []);
      setAgencias(dataAgencias || []);
      if (dataAgencias && dataAgencias.length > 0 && !formCrear.agencia_id) {
        setFormCrear((prev) => ({ ...prev, agencia_id: dataAgencias[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos de personal y agencias.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  // Crear Usuario
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setErrorCrear('');

    const errorPwd = validarPasswordSegura(formCrear.password);
    if (errorPwd) {
      setErrorCrear(errorPwd);
      return;
    }

    setGuardandoCrear(true);

    try {
      const payload = {
        dni: formCrear.dni.trim(),
        nombres: formCrear.nombres.trim(),
        apellidos: formCrear.apellidos.trim(),
        email: formCrear.email.trim(),
        password: formCrear.password,
        tipo: formCrear.tipo,
        agencia_id: formCrear.agencia_id ? Number(formCrear.agencia_id) : null,
        numero_caja: formCrear.tipo === 'cajero' && formCrear.numero_caja ? Number(formCrear.numero_caja) : null,
        licencia_conducir: ['courier', 'transportista'].includes(formCrear.tipo) && formCrear.licencia_conducir ? formCrear.licencia_conducir.trim() : null
      };

      await usuarioService.crearUsuario(payload);
      setShowModalCrear(false);
      setFormCrear({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        password: 'CargaExp#2026',
        tipo: 'cajero',
        agencia_id: agencias[0]?.id || '',
        numero_caja: '',
        licencia_conducir: ''
      });
      mostrarExito('¡Colaborador creado exitosamente!');
      await cargarDatos();
    } catch (err) {
      setErrorCrear(err.message || 'Error al crear el colaborador.');
    } finally {
      setGuardandoCrear(false);
    }
  };

  // Abrir Modal Editar
  const abrirModalEditar = (u) => {
    setUsuarioEditando(u);
    setFormEditar({
      nombres: u.nombres,
      apellidos: u.apellidos,
      email: u.email,
      tipo: u.tipo,
      agencia_id: u.agencia_id || (agencias[0]?.id || ''),
      numero_caja: u.numero_caja || '',
      licencia_conducir: u.licencia_conducir || '',
      password: ''
    });
    setErrorEditar('');
    setShowModalEditar(true);
  };

  // Guardar Edición
  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioEditando) return;
    setErrorEditar('');

    if (formEditar.password && formEditar.password.trim().length > 0) {
      const errorPwd = validarPasswordSegura(formEditar.password);
      if (errorPwd) {
        setErrorEditar(errorPwd);
        return;
      }
    }

    setGuardandoEditar(true);

    try {
      const payload = {
        nombres: formEditar.nombres.trim(),
        apellidos: formEditar.apellidos.trim(),
        email: formEditar.email.trim(),
        tipo: formEditar.tipo,
        agencia_id: formEditar.agencia_id ? Number(formEditar.agencia_id) : null,
        numero_caja: formEditar.tipo === 'cajero' && formEditar.numero_caja ? Number(formEditar.numero_caja) : null,
        licencia_conducir: ['courier', 'transportista'].includes(formEditar.tipo) && formEditar.licencia_conducir ? formEditar.licencia_conducir.trim() : null
      };

      if (formEditar.password && formEditar.password.trim().length >= 8) {
        payload.password = formEditar.password.trim();
      }

      await usuarioService.actualizarUsuario(usuarioEditando.id, payload);
      setShowModalEditar(false);
      mostrarExito(`Colaborador ${formEditar.nombres} actualizado correctamente.`);
      await cargarDatos();
    } catch (err) {
      setErrorEditar(err.message || 'Error al actualizar colaborador.');
    } finally {
      setGuardandoEditar(false);
    }
  };


  // Alternar Activo / Inactivo
  const handleToggleActivo = async (u) => {
    const accion = u.activo ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Estás seguro de que deseas ${accion} el acceso de ${u.nombre_completo}?`)) {
      return;
    }

    try {
      await usuarioService.toggleActivo(u.id);
      mostrarExito(`Acceso de ${u.nombre_completo} actualizado.`);
      await cargarDatos();
    } catch (err) {
      alert(err.message || 'No se pudo cambiar el estado del usuario.');
    }
  };

  // Alternar o Activar 2FA (MFA)
  const handleToggle2FA = async (u) => {
    const accion = u.totp_configurado ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Deseas ${accion} la autenticación de doble factor (2FA/MFA) para ${u.nombre_completo}?`)) {
      return;
    }

    try {
      setLoading2FA(true);
      const res = await usuarioService.toggle2FA(u.id);
      if (res.totp_configurado) {
        setModal2FA({
          usuario: u,
          qr_code: res.qr_code,
          secret: res.secret,
          mensaje: res.mensaje
        });
        mostrarExito(`2FA activado para ${u.nombre_completo}.`);
      } else {
        mostrarExito(`2FA desactivado para ${u.nombre_completo}.`);
      }
      await cargarDatos();
    } catch (err) {
      alert(err.message || 'No se pudo cambiar el estado de 2FA.');
    } finally {
      setLoading2FA(false);
    }
  };


  // Filtrado
  const usuariosFiltrados = usuarios.filter((u) => {
    const cumpleRol = filtroRol === 'todos' || u.tipo.toLowerCase() === filtroRol.toLowerCase();
    const texto = `${u.nombre_completo} ${u.dni} ${u.email} ${u.agencia_nombre || ''}`.toLowerCase();
    const cumpleBusqueda = !busqueda || texto.includes(busqueda.toLowerCase());
    return cumpleRol && cumpleBusqueda;
  });

  const getBadgeRol = (rol) => {
    const r = rol.toLowerCase();
    switch (r) {
      case 'administrador':
        return <span className="badge bg-primary px-3 py-1 rounded-pill">Administrador</span>;
      case 'cajero':
        return <span className="badge bg-success px-3 py-1 rounded-pill">Cajero</span>;
      case 'supervisor':
        return <span className="badge bg-warning text-dark px-3 py-1 rounded-pill">Supervisor</span>;
      case 'almacen':
        return <span className="badge bg-info text-dark px-3 py-1 rounded-pill">Almacén</span>;
      case 'courier':
        return <span className="badge bg-secondary px-3 py-1 rounded-pill">Courier</span>;
      case 'transportista':
        return <span className="badge bg-dark px-3 py-1 rounded-pill">Transportista</span>;
      default:
        return <span className="badge bg-light text-dark px-3 py-1 rounded-pill">{rol}</span>;
    }
  };

  return (
    <div>
      {/* Mensaje flotante de éxito */}
      {mensajeExito && (
        <div className="alert alert-success d-flex align-items-center gap-2 shadow-sm rounded-4 mb-4" role="alert">
          <CheckCircle size={20} className="text-success flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Users className="text-primary" size={26} />
            <span>Personal y Colaboradores</span>
          </h3>
          <p className="text-secondary small mb-0">
            Administración central de cuentas de empleados, asignación de roles operativos (RBAC) y sedes.
          </p>
        </div>

        <button
          className="btn btn-brand px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setErrorCrear('');
            setShowModalCrear(true);
          }}
        >
          <UserPlus size={18} />
          <span>Nuevo Colaborador</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre, DNI, correo o agencia..."
                className="form-control border-start-0"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-5 d-flex gap-2 justify-content-md-end">
            <select
              className="form-select w-auto"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="todos">Todos los Roles</option>
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajeros</option>
              <option value="supervisor">Supervisores</option>
              <option value="almacen">Almacén</option>
              <option value="courier">Couriers</option>
              <option value="transportista">Transportistas</option>
            </select>

            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-1"
              onClick={cargarDatos}
              title="Recargar lista"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="card border-0 shadow-sm rounded-4 p-0 bg-white overflow-hidden">
        {cargando ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <div>Cargando colaboradores desde la base de datos...</div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-danger">
            <AlertCircle size={32} className="mx-auto mb-2 text-danger" />
            <p className="mb-2 fw-semibold">{error}</p>
            <button className="btn btn-sm btn-outline-primary" onClick={cargarDatos}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-4">Colaborador</th>
                  <th>DNI</th>
                  <th>Correo Electrónico</th>
                  <th>Rol Operativo</th>
                  <th>Agencia Asignada</th>
                  <th>2FA</th>
                  <th>Estado</th>
                  <th className="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      No se encontraron colaboradores con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                            style={{ width: '36px', height: '36px', background: u.activo ? '#2b6cb0' : '#a0aec0', fontSize: '13px' }}
                          >
                            {u.nombres[0]}{u.apellidos ? u.apellidos[0] : ''}
                          </div>
                          <div>
                            <strong className="text-dark d-block">{u.nombre_completo}</strong>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              Cód: #{u.codigo_trabajador}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="font-monospace fw-semibold">{u.dni}</td>

                      <td className="text-secondary small">{u.email}</td>

                      <td>{getBadgeRol(u.tipo)}</td>

                      <td>
                        <span className="small text-dark fw-semibold d-flex align-items-center gap-1">
                          <Building size={14} className="text-secondary" />
                          {u.agencia_nombre || 'Sin Asignar'}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-1">
                          {u.totp_configurado ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                              Activo
                            </span>
                          ) : (
                            <span className="badge bg-light text-muted border rounded-pill">
                              Inactivo
                            </span>
                          )}
                          <button
                            className={`btn btn-sm ${u.totp_configurado ? 'btn-outline-danger' : 'btn-outline-primary'} p-1 rounded-2 ms-1`}
                            style={{ width: '26px', height: '26px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title={u.totp_configurado ? 'Desactivar 2FA' : 'Activar 2FA (MFA)'}
                            onClick={() => handleToggle2FA(u)}
                            disabled={loading2FA}
                          >
                            {u.totp_configurado ? <ShieldCheck size={14} /> : <Shield size={14} />}
                          </button>
                        </div>
                      </td>


                      <td>
                        {u.activo ? (
                          <span className="badge bg-success text-white rounded-pill px-2 py-1 small">
                            Habilitado
                          </span>
                        ) : (
                          <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary p-1 rounded-2"
                            title="Editar Colaborador"
                            onClick={() => abrirModalEditar(u)}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'} p-1 rounded-2`}
                            title={u.activo ? 'Desactivar Acceso' : 'Activar Acceso'}
                            onClick={() => handleToggleActivo(u)}
                          >
                            <Power size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR COLABORADOR */}
      {showModalCrear && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <UserPlus size={20} className="text-primary" />
                  <span>Registrar Nuevo Colaborador</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalCrear(false)}
                ></button>
              </div>

              <form onSubmit={handleCrearUsuario}>
                <div className="modal-body px-4 py-3">
                  {errorCrear && (
                    <div className="alert alert-danger rounded-3 small mb-3">
                      <AlertCircle size={16} className="me-1 inline" />
                      {errorCrear}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">DNI (8 dígitos) *</label>
                      <div className="input-group">
                        <input
                          type="text"
                          required
                          maxLength={8}
                          className="form-control"
                          placeholder="Ej: 45678912"
                          value={formCrear.dni}
                          onChange={(e) => {
                            setFormCrear({ ...formCrear, dni: e.target.value.replace(/\D/g, '') });
                            setReniecStatus({ cargando: false, mensaje: '', tipo: '' });
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary d-flex align-items-center gap-1"
                          title="Consultar Portador en RENIEC"
                          onClick={handleBuscarReniecAdmin}
                          disabled={reniecStatus.cargando}
                        >
                          {reniecStatus.cargando ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <>
                              <Search size={14} />
                              <span className="small fw-semibold">RENIEC</span>
                            </>
                          )}
                        </button>
                      </div>
                      {reniecStatus.mensaje && (
                        <small
                          className={`d-block mt-1 ${reniecStatus.tipo === 'ok' ? 'text-success fw-bold' : reniecStatus.tipo === 'error' ? 'text-danger' : 'text-muted'}`}
                          style={{ fontSize: '11px' }}
                        >
                          {reniecStatus.mensaje}
                        </small>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Nombres *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Juan Carlos"
                        value={formCrear.nombres}
                        onChange={(e) => setFormCrear({ ...formCrear, nombres: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Apellidos *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Pérez Ramos"
                        value={formCrear.apellidos}
                        onChange={(e) => setFormCrear({ ...formCrear, apellidos: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Correo Electrónico Corporativo *</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="colaborador@cargaexpress.pe"
                        value={formCrear.email}
                        onChange={(e) => setFormCrear({ ...formCrear, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small fw-semibold mb-0">Contraseña Inicial *</label>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-semibold"
                          style={{ fontSize: '11px' }}
                          onClick={() => setFormCrear((prev) => ({ ...prev, password: generarPasswordSegura() }))}
                        >
                          ⚡ Generar segura
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        minLength={8}
                        className="form-control"
                        placeholder="Mínimo 8 caracteres (A-Z, a-z, 0-9, !@#)"
                        value={formCrear.password}
                        onChange={(e) => setFormCrear({ ...formCrear, password: e.target.value })}
                      />
                      <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                        Políticas: 8+ caracteres, mayúscula, minúscula, número y símbolo.
                      </small>
                    </div>


                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Rol Operativo Asignado (RBAC) *</label>
                      <select
                        className="form-select"
                        value={formCrear.tipo}
                        onChange={(e) => setFormCrear({ ...formCrear, tipo: e.target.value })}
                      >
                        <option value="cajero">Cajero (Caja, cobros y comprobantes)</option>
                        <option value="almacen">Almacén (Stock, guías y manifiestos)</option>
                        <option value="courier">Courier (Repartos y recojos a domicilio)</option>
                        <option value="transportista">Transportista (Camiones y rutas)</option>
                        <option value="supervisor">Supervisor (Agencias y autorizaciones)</option>
                        <option value="administrador">Administrador (Acceso total)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Agencia Asignada *</label>
                      <select
                        className="form-select"
                        value={formCrear.agencia_id}
                        onChange={(e) => setFormCrear({ ...formCrear, agencia_id: e.target.value })}
                      >
                        {agencias.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.departamento}: {ag.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formCrear.tipo === 'cajero' && (
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Número de Caja en Ventanilla</label>
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          placeholder="Ej: 1"
                          value={formCrear.numero_caja}
                          onChange={(e) => setFormCrear({ ...formCrear, numero_caja: e.target.value })}
                        />
                      </div>
                    )}

                    {['courier', 'transportista'].includes(formCrear.tipo) && (
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Licencia de Conducir (Brevete)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ej: Q45678912"
                          value={formCrear.licencia_conducir}
                          onChange={(e) => setFormCrear({ ...formCrear, licencia_conducir: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModalCrear(false)}
                    disabled={guardandoCrear}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-brand fw-bold px-4"
                    disabled={guardandoCrear}
                  >
                    {guardandoCrear ? 'Guardando...' : 'Crear Colaborador'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR COLABORADOR */}
      {showModalEditar && usuarioEditando && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Edit size={20} className="text-primary" />
                  <span>Editar Colaborador: {usuarioEditando.nombre_completo}</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalEditar(false)}
                ></button>
              </div>

              <form onSubmit={handleEditarUsuario}>
                <div className="modal-body px-4 py-3">
                  {errorEditar && (
                    <div className="alert alert-danger rounded-3 small mb-3">
                      {errorEditar}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Nombres *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formEditar.nombres}
                        onChange={(e) => setFormEditar({ ...formEditar, nombres: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Apellidos *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formEditar.apellidos}
                        onChange={(e) => setFormEditar({ ...formEditar, apellidos: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={formEditar.email}
                        onChange={(e) => setFormEditar({ ...formEditar, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Rol Asignado *</label>
                      <select
                        className="form-select"
                        value={formEditar.tipo}
                        onChange={(e) => setFormEditar({ ...formEditar, tipo: e.target.value })}
                      >
                        <option value="cajero">Cajero</option>
                        <option value="almacen">Almacén</option>
                        <option value="courier">Courier</option>
                        <option value="transportista">Transportista</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Agencia Asignada</label>
                      <select
                        className="form-select"
                        value={formEditar.agencia_id}
                        onChange={(e) => setFormEditar({ ...formEditar, agencia_id: e.target.value })}
                      >
                        {agencias.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.departamento}: {ag.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formEditar.tipo === 'cajero' && (
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Número de Caja</label>
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          value={formEditar.numero_caja}
                          onChange={(e) => setFormEditar({ ...formEditar, numero_caja: e.target.value })}
                        />
                      </div>
                    )}

                    {['courier', 'transportista'].includes(formEditar.tipo) && (
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Licencia de Conducir</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formEditar.licencia_conducir}
                          onChange={(e) => setFormEditar({ ...formEditar, licencia_conducir: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="col-12 mt-3 pt-2 border-top">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small fw-semibold text-danger d-flex align-items-center gap-1 mb-0">
                          <Key size={14} />
                          <span>Resetear Contraseña (Dejar en blanco si no se desea cambiar)</span>
                        </label>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-semibold"
                          style={{ fontSize: '11px' }}
                          onClick={() => setFormEditar((prev) => ({ ...prev, password: generarPasswordSegura() }))}
                        >
                          ⚡ Generar segura
                        </button>
                      </div>
                      <input
                        type="text"
                        minLength={8}
                        className="form-control"
                        placeholder="Nueva contraseña segura (mínimo 8 caracteres, mayús, minús, núm, símbolo)"
                        value={formEditar.password}
                        onChange={(e) => setFormEditar({ ...formEditar, password: e.target.value })}
                      />
                      <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                        Políticas: Mínimo 8 caracteres, con al menos una mayúscula, minúscula, número y símbolo (!@#$).
                      </small>
                    </div>

                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModalEditar(false)}
                    disabled={guardandoEditar}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-brand fw-bold px-4"
                    disabled={guardandoEditar}
                  >
                    {guardandoEditar ? 'Actualizando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURACIÓN 2FA (MFA) */}
      {modal2FA && (

        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                  <ShieldCheck size={20} className="text-success" />
                  <span>2FA Activado: {modal2FA.usuario?.nombre_completo}</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModal2FA(null)}
                ></button>
              </div>

              <div className="modal-body p-4 text-center">
                <p className="text-secondary small mb-3">
                  Se ha generado una nueva clave de autenticación multifactor. Escanee el siguiente código QR con la aplicación <strong>Google Authenticator</strong> o <strong>Authy</strong>:
                </p>

                {modal2FA.qr_code && (
                  <div className="d-inline-block p-2 bg-white border rounded-3 shadow-sm mb-3">
                    <img
                      src={modal2FA.qr_code}
                      alt="Código QR 2FA"
                      style={{ width: '180px', height: '180px', display: 'block' }}
                    />
                  </div>
                )}

                {modal2FA.secret && (
                  <div className="mb-3 text-start bg-light p-3 rounded-3 border">
                    <span className="text-muted small d-block mb-1">Clave secreta manual (Base32):</span>
                    <code className="user-select-all fw-bold text-dark fs-6 d-block text-break">
                      {modal2FA.secret}
                    </code>
                  </div>
                )}

                <div className="alert alert-info py-2 px-3 small text-start mb-0">
                  <i className="bi bi-info-circle me-1"></i>
                  El colaborador necesitará introducir el código de 6 dígitos emitido por su celular al iniciar sesión.
                </div>
              </div>

              <div className="modal-footer border-top px-4 py-3">
                <button
                  type="button"
                  className="btn btn-primary w-100 fw-bold"
                  onClick={() => setModal2FA(null)}
                >
                  Entendido y Sincronizado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
