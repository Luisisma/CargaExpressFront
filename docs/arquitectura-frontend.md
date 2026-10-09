# Arquitectura y Especificación Técnica del Frontend CargaExpress

Este documento describe a profundidad la arquitectura, dependencias de software, decisiones de diseño, capa de servicios HTTP, control de acceso RBAC por JWT real y directrices técnicas del cliente Frontend construido con React 19 y Vite.

---

## 1. Ficha Técnica y Stack Tecnológico

La aplicación está construida como una **Single Page Application (SPA)** moderna, de alto rendimiento y desacoplada del backend FastAPI.

### 1.1. Dependencias Principales de Producción (`dependencies`)

| Dependencia | Versión | Propósito Arquitectónico |
| :--- | :--- | :--- |
| **`react`** | `^19.2.8` | Biblioteca principal para la creación de interfaces basada en componentes declarativos y renderizado reactivo. |
| **`react-dom`** | `^19.2.8` | Motor de montaje y reconciliación del Virtual DOM sobre el navegador web (`createRoot`). |
| **`react-router-dom`** | `^7.18.3` | Enrutamiento declarativo del lado del cliente, navegación instantánea (SPA), rutas jerárquicas anidadas y layouts desacoplados con `<Outlet />`. |
| **`bootstrap`** | `^5.3.8` | Sistema de grillas responsivas (grid de 12 columnas), utilidades de espaciado (`m-*`, `p-*`, `d-flex`) y componentes base. |
| **`bootstrap-icons`** | `^1.13.1` | Iconografía vectorial integrada en botones, badges de estado, barras laterales y formularios. |
| **`lucide-react`** | `^1.41.0` | Conjunto complementario de iconos SVG modernos y limpios para tableros analíticos y métricas operativas. |

### 1.2. Herramientas de Desarrollo (`devDependencies`)

| Herramienta | Versión | Rol en la Fase de Desarrollo |
| :--- | :--- | :--- |
| **`vite`** | `^8.2.2` | Empaquetador ultrarrápido (*bundler*) basado en ES Modules nativos con Hot Module Replacement (HMR) instantáneo. |
| **`@vitejs/plugin-react`** | `^6.1.0` | Soporte oficial de Vite para la transformación JSX/TSX y optimización del ciclo de vida de React. |
| **`eslint`** + plugins | `^10.9.0` | Linter de análisis estático de código para garantizar buenas prácticas y reglas estrictas de React Hooks. |

---

## 2. Estructura del Proyecto (`src/`)

La estructura de carpetas implementa una clara separación por capas y dominios:

```text
CargaExpressFront/
├── docs/                          # Documentación técnica viva y bitácoras
│   ├── README.md                  # Índice general del frontend
│   ├── arquitectura-frontend.md   # Especificación de componentes, servicios y RBAC
│   ├── guia-ejecucion-y-rutas.md  # Variables de entorno y mapa de navegación
│   ├── checklist-migracion.md     # Bitácora E2E pantalla por pantalla
│   └── roles-y-permisos-frontend.md # Matriz de roles y capacidades en interfaz
├── public/                        # Archivos estáticos servidos directamente
└── src/
    ├── assets/                    # Logotipos, recursos visuales e imágenes
    ├── components/                # Componentes reutilizables
    │   ├── ModalPagoYape.jsx      # Modal con QR dinámico y simulación de Webhook
    │   └── layout/
    │       ├── PublicLayout.jsx   # Barra de navegación institucional y pie de página
    │       └── AdminLayout.jsx    # Sidebar con RBAC dinámico por JWT y topbar de usuario
    ├── context/
    │   └── AuthContext.jsx        # Contexto global de autenticación JWT y persistencia
    ├── services/                  # Capa desacoplada de consumo HTTP REST (Fetch API)
    │   ├── authService.js         # Login, 2FA, Refresh Token, Recuperar Contraseña y Logout
    │   ├── envioService.js        # Envíos: listado, detalle, pesaje, despacho, arribo y entrega
    │   ├── usuarioService.js      # CRUD de colaboradores, asignación de roles y 2FA
    │   ├── clienteService.js      # Directorio con autocompletado RENIEC/SUNAT
    │   ├── dashboardService.js    # KPIs analíticos y últimos despachos
    │   └── publicService.js       # Agencias, cotizador y pre-registro web
    ├── pages/                     # Vistas agrupadas por dominio funcional
    │   ├── public/                # Home, Cotizador, RegistrarPedido, PedidoExitoso, Tracking
    │   ├── auth/                  # Login, Verificacion2FA, RecuperarPassword, RestablecerPassword
    │   └── admin/                 # Módulos operativos y administrativos:
    │       ├── Dashboard.jsx      # Tablero operativo adaptativo por rol
    │       ├── envios/            # EnviosList.jsx, EnvioDetalle.jsx (con modal de entrega)
    │       ├── caja/              # RecepcionEnvios.jsx (pesaje balanza y cobro), CajaDashboard.jsx
    │       ├── almacen/           # AlmacenDespacho.jsx, AlmacenArribos.jsx, AlmacenStock.jsx
    │       ├── agencias/          # AgenciasList.jsx
    │       ├── clientes/          # ClientesList.jsx
    │       ├── usuarios/          # UsuariosList.jsx
    │       ├── guias/             # GuiasList.jsx
    │       ├── manifiestos/       # ManifiestosList.jsx
    │       └── courier/           # CourierRepartos.jsx
    ├── routes/
    │   └── AppRouter.jsx          # Enrutador central declarativo (React Router v7)
    ├── index.css                  # Tokens de color institucionales y utilidades globales
    ├── App.jsx                    # Contenedor raíz con AuthProvider
    └── main.jsx                   # Punto de entrada React 19 (ReactDOM.createRoot)
```

---

## 3. Capa de Servicios HTTP (`src/services/`)

Toda la comunicación con FastAPI se centraliza en funciones de servicio asíncronas que gestionan cabeceras, inyección automática de tokens JWT y normalización de errores:

```javascript
// Patrón de consumo estandarizado en servicios:
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};
```

### Servicios Principales:
1. **`authService.js`:**
   - `login(identificador, password)`: Inicio de sesión con detección de requerimiento 2FA.
   - `verificar2FA(temp_token, codigo_totp)`: Intercambio de token temporal por Access Token.
   - `solicitarRecuperacion(identificador)`: Solicitud de restablecimiento vía Mailtrap.
   - `restablecerPassword(token, password)`: Cambio de clave con token firmado.
   - `cerrarSesion()`: Invalidación de tokens en backend incrementando `sesion_version`.
2. **`envioService.js`:**
   - `recepcionarEnvio(codigo, data)`: Registro de pesaje en balanza y cobro en origen.
   - `despacharEnvio(codigo, data)`: Salida de camión hacia `en_ruta`.
   - `arribarEnvio(codigo, data)`: Recepción de camión y transición a `en_agencia_destino`.
   - `entregarEnvio(codigo, data)`: Cierre del ciclo de vida exigiendo DNI de quien recoge (`BR-ENV-04`).
3. **`usuarioService.js`:**
   - Listado, creación, edición, toggle de activación y enrolamiento QR de 2FA para colaboradores.

---

## 4. Control de Acceso y RBAC Real por JWT

A diferencia de prototipos con selectores artificiales, el sistema implementa **RBAC estricto gobernado por JWT**:

1. **Extracción de Identidad:**
   Al iniciar sesión exitosamente, el objeto `usuario` (con `rol`, `nombre` y `agencia_id`) se almacena en el estado de `AuthContext`.
2. **Filtrado Dinámico en `AdminLayout.jsx`:**
   El menú lateral (`MENU_ITEMS`) evalúa en tiempo real los roles autorizados para cada ítem:
   - **Administrador:** Acceso irrestricto a todos los módulos (Usuarios, Finanzas, Logística).
   - **Cajero:** Dashboard, Mis Envíos, Admisión en Balanza, Clientes y Catálogo.
   - **Almacén:** Dashboard, Mis Envíos, Despacho a Ruta, Arribos (Descarga), Guías y Manifiestos. *Las acciones financieras y creación de personal quedan estrictamente ocultas.*
   - **Courier:** Dashboard, Mis Envíos y Repartos a Domicilio.
3. **Respaldo en Servidor:**
   Cualquier intento de forzar una URL en el navegador es bloqueado por las dependencias `require_role([...])` de FastAPI devolviendo `HTTP 403 Forbidden`.

---

## 5. Sistema de Diseño y Tokens CSS (`src/index.css`)

El diseño visual reproduce fielmente la identidad gráfica corporativa mediante variables nativas CSS:

### 5.1. Variables y Tokens de Color
```css
:root {
  --sidebar-width: 260px;
  --primary: #1a365d;        /* Azul Noche Institucional */
  --primary-light: #2b6cb0;  /* Azul Medio Botones e Iconos */
  --accent: #e53e3e;         /* Rojo Distintivo CargaExpress */
  --success: #38a169;        /* Verde Entregado / Pagado */
  --warning: #d69e2e;        /* Ámbar En Tránsito / Pendiente */
  --bg-sidebar: #0f2442;     /* Azul Marino Profundo para Sidebar */
  --radius: 10px;            /* Radio de esquinas de componentes */
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
}
```

### 5.2. Componentes CSS Reutilizables
* `.page-shell`: Contenedor principal para estandarizar márgenes de pantallas internas.
* `.metric-card`: Tarjeta analítica blanca con elevación suave, icono destacado y valor numérico de impacto.
* `.data-card`: Contenedor para tablas de datos con encabezado, buscador y pie paginador.
* `.data-table`: Estilo de tabla con tipografía compacta (`13px`), cabeceras en mayúsculas (`11px`) y filas con hover.
* `.status-badge`: Distintivos visuales para estados logísticos (*Registrado*, *En Tránsito*, *En Agencia Destino*, *Entregado*).
