# Checklist de Migración Frontend CargaExpress

Este documento sirve como bitácora de seguimiento pantalla por pantalla para el equipo de desarrollo.

---

## 1. Vistas Públicas y Clientes

| Vista / Pantalla | Ruta | Estado | Responsivo Celular | Observaciones |
| :--- | :--- | :---: | :---: | :--- |
| **Inicio (Landing)** | `/` | ✅ Completo | ✅ Sí | Hero con degradado institucional, tracking box interactivo, sección "¿Por qué elegirnos?" y RUC `20100227461`. |
| **Cotizador de Envíos** | `/cotizar` | ✅ Completo | ✅ Sí | Algoritmo de peso volumétrico (`L * A * H / 6000`), selector de agencias origen/destino y desglose de flete. |
| **Registro de Pedido** | `/registrar-pedido` | ✅ Completo | ✅ Sí | Versión mejorada: Stepper en 4 pasos, simulación de búsqueda RENIEC/SUNAT, 4 modalidades de entrega, banner de precio dinámico sticky en smartphone y botones táctiles. |
| **Confirmación de Pedido** | `/pedido-exitoso/:tracking` | ✅ Completo | ✅ Sí | Resumen con código de seguimiento generado y código QR descargable simulado. |
| **Rastreo de Encomienda** | `/tracking` y `/tracking/:codigo` | ✅ Completo | ✅ Sí | Buscador manual y línea de tiempo cronológica con estados logísticos. |

---

## 2. Vistas de Autenticación (Conexión Real Backend FastAPI)

| Vista / Pantalla | Ruta | Estado | Responsivo Celular | Observaciones |
| :--- | :--- | :---: | :---: | :--- |
| **Login Empleados** | `/auth/login` | ✅ Conectado E2E | ✅ Sí | Conectado a `/api/v1/auth/login`. Valida credenciales contra la BD, anti-fuerza bruta y detecta si requiere 2FA. |
| **Verificación 2FA** | `/auth/2fa` | ✅ Conectado E2E | ✅ Sí | Conectado a `/api/v1/auth/2fa`. **Generación interactiva de QR en pantalla** para Google Authenticator, clave manual y redirección automática al Dashboard. |

---

## 3. Vistas Administrativas (`/admin/*`)

> **Nota de Alcance:** A solicitud del equipo, el panel administrativo está optimizado y centrado en la **experiencia de PC de escritorio**. La adaptación responsiva móvil de estas pantallas se mantiene como tarea pendiente para una fase futura.

| Vista / Pantalla | Ruta | Estado | Enfoque PC | Tareas Pendientes |
| :--- | :--- | :---: | :---: | :--- |
| **Dashboard Operativo** | `/admin/dashboard` | ✅ Completo | ✅ Optimizado | Réplica fiel de 4 KPIs, tabla de Últimos Envíos con datos reales, acciones rápidas y scrollbar oculto. *(Mobile pendiente)* |
| **Listado de Envíos** | `/admin/envios` | ✅ Base | ✅ Sí | Filtros por estado, búsqueda por tracking y tabla con badges. |
| **Ficha de Envío** | `/admin/envios/:id` | ✅ Base | ✅ Sí | Datos de remitente, destinatario, paquete y línea de tiempo. |
| **Admisión en Ventanilla** | `/admin/envios/nuevo` | ⏳ Pendiente | 💻 PC | Crear formulario para que el cajero recepcione carga física y cobre en ventanilla. |
| **Caja y Turnos** | `/admin/caja` | ⚠️ Base | 💻 PC | Implementar modales de apertura de turno, entrada/salida de caja y arqueo de cierre. |
| **Almacén y Stock** | `/admin/almacen` | ⚠️ Base | 💻 PC | Incorporar tabla detallada de bultos por estante y estado de precinto. |
| **Guías de Remisión** | `/admin/guias` | ⚠️ Base | 💻 PC | Añadir tabla de guías electrónicas remitente/transportista y acción de impresión simulada. |
| **Manifiestos de Carga** | `/admin/manifiestos` | ⚠️ Base | 💻 PC | Crear vista de consolidado de carga por vehículo, camión y conductor. |
| **Courier y Reparto** | `/admin/courier` | ⚠️ Base | 💻 PC | Crear vista de hoja de ruta local para entregas a domicilio. |
| **Catálogo de Agencias** | `/admin/agencias` | ✅ Completo | 💻 PC | Directorio con las 52 sedes a nivel nacional. |
| **Directorio de Clientes** | `/admin/clientes` | ✅ Completo | 💻 PC | Directorio con filtros DNI/RUC. |
| **Gestión de Usuarios** | `/admin/usuarios` | ✅ Completo | 💻 PC | Tabla de personal, sucursales asignadas y cambio de rol. |
