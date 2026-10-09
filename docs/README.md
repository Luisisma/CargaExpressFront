# Documentación Técnica y Estado de Implementación Frontend

Esta carpeta contiene la documentación oficial del cliente **CargaExpress Frontend (`CargaExpressFront`)**, construida como una Single Page Application (SPA) con **React 19** y **Vite**, completamente integrada de extremo a extremo (E2E) con el Backend REST API FastAPI.

---

## 1. Ficha Técnica y Stack Tecnológico

* **Librería Core:** React 19.2.8
* **Herramienta de Construcción:** Vite 8.2 (HMR instantáneo y build optimizado de producción)
* **Enrutamiento:** React Router DOM 7.2 (navegación declarativa por layouts y rutas anidadas)
* **Estilos y UI:** Bootstrap 5.3.8 + Bootstrap Icons 1.13.1 + Vanilla CSS modular en `src/index.css`
* **Iconografía Complementaria:** Lucide React + Bootstrap Icons
* **Tipografía Oficial:** Google Font *Plus Jakarta Sans* (pesos 300 a 800)
* **Identidad de Marca:** RUC Oficial `20100227461`, colores institucionales (`#1a365d` Azul Noche, `#2b6cb0` Azul Medio, `#e53e3e` Rojo Acento, `#0f2442` Fondo Sidebar).
* **Consumo API:** Fetch API nativo desacoplado en `src/services/` con inyección automática de cabeceras `Authorization: Bearer <JWT>`.

---

## 2. Mapa de Documentación en esta Carpeta (`docs/`)

| Documento | Descripción y Contenido |
| :--- | :--- |
| **[README.md](README.md)** | Índice general, stack y estado del proyecto (este archivo). |
| **[arquitectura-frontend.md](arquitectura-frontend.md)** | Especificación de componentes, layouts, capa de servicios HTTP y diseño visual. |
| **[guia-ejecucion-y-rutas.md](guia-ejecucion-y-rutas.md)** | Variables de entorno `.env`, comandos de ejecución y mapa exhaustivo de URLs. |
| **[checklist-migracion.md](checklist-migracion.md)** | Bitácora de seguimiento pantalla por pantalla con estado de integración E2E. |
| **[roles-y-permisos-frontend.md](roles-y-permisos-frontend.md)** | Matriz RBAC de visibilidad por rol (Admin, Cajero, Almacén, Courier) y ciclo de vida del envío. |

---

## 3. Estructura del Código Fuente (`src/`)

```text
CargaExpressFront/
├── docs/                             # Documentación técnica viva y guías
│   ├── README.md
│   ├── arquitectura-frontend.md
│   ├── guia-ejecucion-y-rutas.md
│   ├── checklist-migracion.md
│   └── roles-y-permisos-frontend.md
├── public/                           # Recursos estáticos servidos directamente
└── src/
    ├── components/
    │   ├── ModalPagoYape.jsx         # Modal de pago con QR y webhook simulado
    │   └── layout/
    │       ├── PublicLayout.jsx      # Navbar público corporativo y footer
    │       └── AdminLayout.jsx       # Sidebar con RBAC estricto gobernado por JWT
    ├── context/
    │   └── AuthContext.jsx           # Proveedor de sesión JWT real y persistencia
    ├── services/                     # Capa desacoplada de consumo HTTP REST
    │   ├── authService.js            # Login, 2FA, recuperación y logout
    │   ├── envioService.js           # Envíos, pesaje, despacho, arribo y entrega
    │   ├── usuarioService.js         # CRUD de colaboradores y enrolamiento 2FA
    │   ├── clienteService.js         # Directorio de clientes con autocompletado
    │   ├── dashboardService.js       # Métricas operativas del tablero
    │   └── publicService.js          # Cotizador, agencias y pre-registro web
    ├── pages/
    │   ├── public/                   # Vistas de acceso libre (Home, Cotizar, Tracking...)
    │   ├── auth/                     # Autenticación (Login, 2FA, Recuperación de clave)
    │   └── admin/                    # Módulos operativos y administrativos:
    │       ├── Dashboard.jsx         # Tablero con KPIs reactivos por rol
    │       ├── envios/               # EnviosList.jsx, EnvioDetalle.jsx (con modal de entrega)
    │       ├── caja/                 # RecepcionEnvios.jsx (balanza y cobro), CajaDashboard.jsx
    │       ├── almacen/              # AlmacenDespacho.jsx, AlmacenArribos.jsx, AlmacenStock.jsx
    │       ├── agencias/             # AgenciasList.jsx
    │       ├── clientes/             # ClientesList.jsx
    │       ├── usuarios/             # UsuariosList.jsx (RBAC)
    │       ├── guias/                # GuiasList.jsx
    │       ├── manifiestos/          # ManifiestosList.jsx
    │       └── courier/              # CourierRepartos.jsx
    ├── routes/
    │   └── AppRouter.jsx             # Enrutador central declarativo (React Router v7)
    ├── index.css                     # Tokens CSS institucionales y clases utilitarias
    ├── App.jsx                       # Montaje raíz con AuthProvider
    └── main.jsx                      # Punto de entrada React 19
```

---

## 4. Hitos de Implementación Culminados E2E

### ✅ 1. Portal Público y Clientes
- **Landing Page (`/`):** Hero visual, tracking interactivo y propuesta de valor con diseño responsivo móvil.
- **Cotizador de Envíos (`/cotizar`):** Consumo del endpoint oficial `/api/v1/publico/cotizar` con fórmula $(L \times A \times H)/6000$ y recargo a domicilio.
- **Pre-registro Web (`/registrar-pedido`):** Stepper en 4 pasos, autocompletado en tiempo real con RENIEC y SUNAT (`GET /api/v1/publico/buscar-cliente`), cálculo contable de IGV y generación de pre-orden.
- **Tracking en Vivo (`/tracking/:codigo`):** Rastreo público con enmascaramiento estricto de PII y cronología de hitos.

### ✅ 2. Seguridad y Autenticación con JWT Real
- **Login (`/auth/login`):** Validación contra la base de datos y emisión de token Bearer.
- **Segundo Factor 2FA (`/auth/2fa`):** Validación de TOTP de 6 dígitos con generación de QR en pantalla.
- **Recuperación de Contraseña (`/auth/recuperar-password` y `/auth/restablecer-password`):** Tokens temporales de 15 minutos e integración de correos vía Mailtrap.
- **Cierre de Sesión:** Invalidación global en servidor incrementando `sesion_version`.

### ✅ 3. Intranet Operativa y Cadena de Vida Completa del Envío
- **Recepción en Balanza (`/admin/caja/recepcion`):** Pesaje oficial en origen, recálculo tarifario por sobrepeso (`BR-TAR-02`), cobro en mostrador (Efectivo/Yape con Webhook) y transición a `en_almacen_origen`.
- **Despacho a Ruta (`/admin/almacen/despacho`):** Validación de bultos pagados (`BR-ENV-02`), selección de camión y transición a `en_ruta`.
- **Arribo y Descarga (`/admin/almacen/arribos`):** Recepción de camión en sede destino y transición a `en_agencia_destino`.
- **Entrega Final (`/admin/envios/:id`):** Botón verde interactivo y modal con registro obligatorio de DNI y parentesco del receptor físico (`BR-ENV-04`), cerrando la orden en `entregado`.
- **RBAC por JWT Real:** Menú lateral de `AdminLayout.jsx` y métricas del `Dashboard.jsx` adaptadas al rol del colaborador (las finanzas no son visibles para operadores de bodega).
- **Gestión de Usuarios (`/admin/usuarios`):** Mantenimiento de personal con asignación de roles NIST y enrolamiento de 2FA.
