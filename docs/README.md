# Documentación de Arquitectura y Guía de Migración Frontend

Esta carpeta contiene la documentación oficial del cliente **CargaExpress Frontend (`CargaExpressFront`)**, diseñada para brindar contexto técnico completo, arquitectura del proyecto, estado de avance y la guía paso a paso para continuar con las siguientes fases de desarrollo y mejoras.

---

## 1. Arquitectura Técnica Actual

El cliente Frontend se implementó como una **Single Page Application (SPA)** desacoplada, siguiendo los estándares de diseño corporativo de CargaExpress Perú S.A.C.:

* **Librería Core:** React 19.0.0
* **Herramienta de Construcción:** Vite 8.2 (HMR instantáneo y build optimizado)
* **Enrutamiento:** React Router DOM 7.2 (navegación declarativa por layouts y guardianes)
* **Estilos y UI:** Bootstrap 5.3.3 + Bootstrap Icons 1.11.3 + Vanilla CSS en `src/index.css`
* **Iconografía Complementaria:** Lucide React + Bootstrap Icons
* **Tipografía Oficial:** Google Font *Plus Jakarta Sans* (pesos 300 a 800)
* **Identidad de Marca:** RUC Oficial `20100227461`, colores institucionales HSL/HEX (`#1a365d` Azul Noche, `#2b6cb0` Azul Medio, `#e53e3e` Rojo Acento, `#0f2442` Fondo Sidebar).

---

## 2. Estructura del Código Fuente (`src/`)

```text
CargaExpressFront/
├── index.html
├── package.json
├── vite.config.js
├── docs/                           # Documentación técnica y bitácoras
│   ├── README.md                   # Índice general
│   ├── guia-ejecucion-y-rutas.md   # Comandos para levantar el proyecto y mapa de URLs
│   ├── arquitectura-frontend.md    # Especificación de componentes y layouts
│   └── checklist-migracion.md      # Estado detallado de avance por pantalla
├── public/
│   ├── favicon.svg                 # Isotipo de la caja
│   └── portada.jpg                 # Fotografía del almacén para Login y 2FA
└── src/
    ├── index.css                   # Sistema de diseño, tokens, metric-cards, scrollbars
    ├── App.jsx                     # Proveedor AuthProvider y AppRouter
    ├── main.jsx                    # Punto de entrada React 19
    ├── context/
    │   └── AuthContext.jsx         # Simulación de sesión con switcher de roles (admin, cajero, almacen, courier)
    ├── components/
    │   └── layout/
    │       ├── PublicLayout.jsx    # Navbar con enlaces públicos y footer corporativo
    │       └── AdminLayout.jsx     # Sidebar idéntico al monolito con selector de rol y topbar
    ├── pages/
    │   ├── public/                 # Vistas de acceso público
    │   │   ├── Home.jsx            # Landing page con tracking box interactivo
    │   │   ├── Cotizador.jsx       # Cotizador volumétrico (L*A*H / 6000)
    │   │   ├── RegistrarPedido.jsx # Formulario multi-paso con soporte responsivo móvil avanzado
    │   │   ├── PedidoExitoso.jsx   # Confirmación con código tracking y código QR simulado
    │   │   └── Tracking.jsx        # Línea de tiempo cronológica de encomiendas
    │   ├── auth/                   # Autenticación de colaboradores
    │   │   ├── Login.jsx           # Paso 1: Login de 2 columnas con curva SVG y fondo de almacén
    │   │   └── Verificacion2FA.jsx # Paso 2: TOTP de 6 dígitos con diseño integrado
    │   └── admin/                  # Panel administrativo y de operaciones
    │       ├── Dashboard.jsx       # Tablero operativo réplica exacta del monolito (PC)
    │       ├── envios/             # Gestión de encomiendas (EnviosList, EnvioDetalle)
    │       ├── caja/               # Apertura, arqueo y liquidación de caja
    │       ├── almacen/            # Stock físico de bultos
    │       ├── guias/              # Guías de remisión electrónicas
    │       ├── manifiestos/        # Consolidado de carga interprovincial en camiones
    │       ├── courier/            # Reparto de última milla a domicilio
    │       ├── agencias/           # Directorio de las 52 agencias nacionales
    │       ├── clientes/           # Directorio y búsqueda de clientes DNI/RUC
    │       └── usuarios/           # Mantenimiento de personal y perfiles
    └── routes/
        └── AppRouter.jsx           # Configuración central de rutas públicas y privadas
```

---

## 3. Estado de Avance por Módulos

### ✅ Módulos Culminados:
1. **Portal Público y Clientes:**
   * **Home (`/`):** Réplica visual fiel con hero gradient, recuadro de rastreo y beneficios. Responsividad total para celulares y tablets.
   * **Cotizador (`/cotizar`):** Algoritmo de peso volumétrico funcional.
   * **Registro de Pedido (`/registrar-pedido`):** Stepper interactivo en 4 pasos, selector DNI/RUC con autocompletado RENIEC simulado, panel de precio estimado dinámico y **diseño responsivo móvil optimizado** (banner de precio sticky, botones touch de ancho completo).
   * **Tracking (`/tracking`):** Historial y timeline de eventos.
2. **Autenticación:**
   * **Login (`/auth/login`) y 2FA (`/auth/2fa`):** Diseño de 2 columnas con imagen institucional `/portada.jpg`, divisor curvo sinusoidal SVG y adaptación para pantallas táctiles.
3. **Dashboard Administrativo (`/admin/dashboard` - Versión PC):**
   * Réplica exacta de los 4 KPIs corporativos (Total Envíos, Envíos Hoy, Ingresos Hoy, Pendientes de Pago).
   * Tabla de "Últimos Envíos" sincronizada con los registros reales del sistema.
   * Acciones rápidas (`Registrar Envío`, `Generar Guías`, `Generar Manifiestos`, `Gestionar Usuarios`).
   * Eliminación y ocultamiento total de la barra de desplazamiento (*scrollbar*) en el menú lateral para PC de escritorio.

---

## 4. Tareas Pendientes (Roadmap de Continuidad)

Para la persona o equipo que continúe la migración de Frontend:

1. **Panel Administrativo en Móviles (Smartphone / Tablet):**
   * *Estado:* Actualmente el panel `/admin/*` está optimizado para experiencia de escritorio (PC).
   * *Acción futura:* Adaptar las tablas y tarjetas internas a interfaces móviles de una sola columna cuando se requiera soporte administrativo en celulares.
2. **Formulario en Ventanilla (`/admin/envios/nuevo`):**
   * Construir la vista que utiliza el cajero físico en agencia para pesar la encomienda, seleccionar tipo de pago (efectivo, Yape, Plin) e imprimir etiqueta de despacho.
3. **Modales de Caja (`/admin/caja`):**
   * Agregar ventanas modales para Apertura de Turno, Movimiento de Entrada/Salida de efectivo y Arqueo de Cierre diario.
4. **Enriquecimiento de Vistas Logísticas (`/admin/almacen`, `/admin/guias`, `/admin/manifiestos`):**
   * Incorporar tablas con filtros avanzados y botones de acción (Imprimir Guía en PDF, Asignar Camión, Descargar Manifiesto).
5. **Fase 2 - Conexión al Backend (FastAPI):**
   * En cada página existe un comentario señalando dónde se sustituirán los datos simulados (*mocks*) por llamadas `fetch` / `axios` hacia los endpoints REST de la API (`/api/v1/...`).

---

## 5. Guías Relacionadas

* [Guía de Ejecución y Rutas](guia-ejecucion-y-rutas.md): Pasos para instalar, correr `npm run dev` y listado completo de rutas.
* [Arquitectura y Rutas Detalladas](arquitectura-frontend.md): Especificación técnica exhaustiva de props, layouts y guardianes.
* [Checklist de Migración](checklist-migracion.md): Lista de verificación elemento por elemento.
