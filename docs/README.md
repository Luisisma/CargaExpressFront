# Documentación Frontend CargaExpress

Esta carpeta almacena la especificación y bitácora de arquitectura del cliente Frontend, alineada a la metodología **Spec-Driven Development**.

Para instrucciones de arranque y puertos, consulta la [Guía de Ejecución y Rutas](guia-ejecucion-y-rutas.md).

## Módulos y Rutas Implementadas

### 1. Rutas Públicas (Layout Público)
- `/`: Landing institucional, beneficios y accesos rápidos.
- `/cotizar`: Simulador de tarifas según peso real y peso volumétrico (`L * A * H / 6000`).
- `/registrar-pedido`: Formulario público para orden de entrega rápida en ventanilla.
- `/pedido-exitoso/:tracking`: Confirmación con código de tracking y QR simulado.
- `/tracking` y `/tracking/:codigo`: Historial cronológico de la encomienda.

### 2. Autenticación (Portal Colaborador)
- `/auth/login`: Credenciales institucionales (DNI y Contraseña).
- `/auth/2fa`: Verificación de código TOTP de 6 dígitos.

### 3. Portal Administrativo (`/admin/*`)
- `/admin/dashboard`: Métricas de la jornada (ingresos de caja, paquetes en almacén, encomiendas).
- `/admin/envios`: Listado y filtros de órdenes.
- `/admin/envios/:id`: Detalle completo de orden y estados.
- `/admin/caja`: Control de flujo y arqueo.
- `/admin/almacen`: Stock físico en agencia.
- `/admin/guias`: Guías de remisión.
- `/admin/manifiestos`: Despacho consolidado por vehículo.
- `/admin/courier`: Repartos de última milla.
- `/admin/agencias`: Catálogo de 52 sedes nacionales.
- `/admin/clientes`: Directorio de clientes.
- `/admin/usuarios`: Gestión de personal y roles.
