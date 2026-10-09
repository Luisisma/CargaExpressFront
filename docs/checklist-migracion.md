# Checklist de Migración y Estado E2E del Frontend CargaExpress

Este documento sirve como bitácora viva de seguimiento pantalla por pantalla para el equipo de desarrollo, certificando la integración real con el Backend FastAPI y el estado de cada vista.

---

## 1. Vistas Públicas y Clientes

| Vista / Pantalla | Ruta | Estado | Responsivo Móvil | Integración Backend | Observaciones |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Inicio (Landing)** | `/` | ✅ Completo | ✅ Sí | N/A | Hero institucional, tracking box interactivo, sección corporativa y RUC oficial `20100227461`. |
| **Cotizador de Envíos** | `/cotizar` | ✅ Completo | ✅ Sí | `POST /api/v1/publico/cotizar` | Cálculo tarifario en servidor con fórmula $(L \times A \times H)/6000$, peso liquidable y recargo a domicilio. |
| **Registro de Pedido** | `/registrar-pedido` | ✅ Completo | ✅ Sí | `POST /api/v1/publico/pedidos/registrar` | Stepper en 4 pasos, autocompletado en tiempo real con RENIEC y SUNAT (`GET /api/v1/publico/buscar-cliente`), cálculo de IGV y banner sticky en smartphone. |
| **Confirmación de Pedido** | `/pedido-exitoso/:tracking` | ✅ Completo | ✅ Sí | Integrado | Resumen con código de seguimiento generado, descarga de voucher y código QR de pre-orden. |
| **Rastreo de Encomienda** | `/tracking` y `/tracking/:codigo` | ✅ Completo | ✅ Sí | `GET /api/v1/publico/tracking/{codigo}` | Rastreo público con enmascaramiento estricto de PII y línea de tiempo cronológica de hitos logísticos. |

---

## 2. Vistas de Autenticación y Seguridad (FastAPI E2E)

| Vista / Pantalla | Ruta | Estado | Responsivo Móvil | Integración Backend | Observaciones |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Login Colaboradores** | `/auth/login` | ✅ Conectado E2E | ✅ Sí | `POST /api/v1/auth/login` | Autenticación con DNI/correo y contraseña Bcrypt. Emite JWT Bearer completo o token temporal de 5 min si requiere 2FA. |
| **Verificación 2FA** | `/auth/2fa` | ✅ Conectado E2E | ✅ Sí | `POST /api/v1/auth/2fa` | Validación de código TOTP de 6 dígitos (Google Authenticator / Authy), QR visual en pantalla si es primera vez y acceso al Dashboard. |
| **Recuperar Contraseña** | `/auth/recuperar-password` | ✅ Conectado E2E | ✅ Sí | `POST /api/v1/auth/recuperar-password` | Solicitud por DNI/correo. Genera enlace con token JWT firmado de 15 minutos y envía correo real vía Mailtrap. |
| **Restablecer Contraseña**| `/auth/restablecer-password`| ✅ Conectado E2E | ✅ Sí | `POST /api/v1/auth/restablecer-password`| Validación de token firmado por URL, cambio de clave con política de contraseñas e invalidación global de sesiones previas. |

---

## 3. Vistas Administrativas y Operativas (`/admin/*`)

> **Control de Acceso (RBAC):** Las opciones del Sidebar y accesos rápidos se gobiernan estrictamente mediante el rol real extraído del token JWT (`user.rol` / `user.tipo`), eliminando simuladores artificiales.

| Vista / Pantalla | Ruta | Estado | Rol Autorizado | Integración Backend | Observaciones |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **Dashboard Operativo** | `/admin/dashboard` | ✅ Conectado E2E | Todos los roles | `GET /api/v1/dashboard/resumen` | KPIs adaptativos según rol (Cajero/Admin ve métricas de ingresos; Almacén ve despachos y arribos pendientes). |
| **Listado de Envíos** | `/admin/envios` | ✅ Conectado E2E | Admin, Cajero, Almacén | `GET /api/v1/envios` | Búsqueda por tracking o cliente, filtros por estado logístico (`registrado`, `en_ruta`, `en_agencia_destino`, `entregado`) y estado de pago. |
| **Ficha de Envío** | `/admin/envios/:id` | ✅ Conectado E2E | Admin, Cajero, Almacén | `GET /api/v1/envios/{id}` y `POST .../entregar` | Ficha técnica completa con desglose tarifario, cronología e **interfaz de Entrega Final al Destinatario** con validación de DNI físico (`BR-ENV-04`). |
| **Recepción en Balanza (Caja)** | `/admin/caja/recepcion` | ✅ Conectado E2E | Admin, Cajero | `POST /api/v1/envios/{codigo}/recepcionar` | Pesaje en balanza oficial, recálculo de flete por sobrepeso (`BR-TAR-02`), cobro en mostrador (Efectivo/Yape) y emisión de ticket. |
| **Despacho a Ruta (Almacén)** | `/admin/almacen/despacho` | ✅ Conectado E2E | Admin, Almacén | `POST /api/v1/envios/{codigo}/despachar` | Carga de bultos a camión de transporte interprovincial, validación de pago obligatorio (`BR-ENV-02`) y transición a `en_ruta`. |
| **Arribo y Descarga (Almacén)** | `/admin/almacen/arribos` | ✅ Conectado E2E | Admin, Almacén | `POST /api/v1/envios/{codigo}/arribar` | Recepción de camión en sede destino, verificación física de precintos y transición a `en_agencia_destino`. |
| **Gestión de Personal** | `/admin/usuarios` | ✅ Conectado E2E | Administrador | `GET / POST / PUT / PATCH /api/v1/usuarios` | CRUD de empleados con RBAC, asignación de sedes, activación/desactivación y enrolamiento de 2FA TOTP con QR. |
| **Directorio de Clientes** | `/admin/clientes` | ✅ Conectado E2E | Admin, Cajero | `GET /api/v1/clientes` | Directorio con historial de encomiendas y filtros por DNI/RUC. |
| **Catálogo de Agencias** | `/admin/agencias` | ✅ Conectado E2E | Todos | `GET /api/v1/publico/agencias` | Consulta de las 52 agencias a nivel nacional. |
| **Caja y Turnos (Arqueo)** | `/admin/caja` | 📋 Sprint 05 | Admin, Cajero | `GET /api/v1/caja/*` | Apertura de turno con monto base y arqueo ciego al cierre. |
| **Guías de Remisión** | `/admin/guias` | ⚠️ Base Visual | Admin, Almacén | En desarrollo | Emisión de GRE Transportista y Remitente SUNAT. |
| **Manifiestos de Carga** | `/admin/manifiestos` | ⚠️ Base Visual | Admin, Almacén | En desarrollo | Hoja de ruta consolidada por chofer y placa de vehículo. |
| **Courier (Última Milla)** | `/admin/courier` | ⚠️ Base Visual | Admin, Courier | En desarrollo | Asignación de paquetes con modalidad a domicilio. |
