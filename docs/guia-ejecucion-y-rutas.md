# Guía de Ejecución y Mapa de Rutas del Frontend

Esta guía detalla las herramientas, variables de entorno y el mapa exhaustivo de rutas para ejecutar y navegar el cliente **CargaExpressFront**.

---

## 1. Requisitos Previos y Variables de Entorno

El Frontend se conecta al backend FastAPI mediante variables de entorno Vite (`import.meta.env`).

### Archivo `.env` (en la raíz de `CargaExpressFront/`):
```env
# URL base del Backend REST API FastAPI
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 2. Comandos para Levantar el Frontend

Abre tu terminal PowerShell en la carpeta del frontend y ejecuta:

```powershell
# 1. Ingresar a la carpeta del proyecto
cd c:\Users\User\Documents\VSC-Integrador\CargaExpressFront

# 2. Instalar dependencias (solo si es primera vez o hubo cambios en package.json)
npm install

# 3. Levantar el servidor de desarrollo Vite con Hot Module Replacement (HMR)
npm run dev
```

Una vez que Vite inicie, verás en la consola:
```text
  VITE ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en: [http://localhost:5173/](http://localhost:5173/)

---

## 3. Comandos Útiles Disponibles

* `npm run dev`: Inicia el servidor de desarrollo en modo interactivo.
* `npm run build`: Compila y optimiza los bundles de producción en la carpeta `dist/`.
* `npm run preview`: Previsualiza la compilación de producción generada en `dist/` localmente.
* `npm run lint`: Ejecuta el análisis estático de código para garantizar buenas prácticas en React.

---

## 4. Mapa Exhaustivo de Rutas y Navegación

### A. Portal Público y Clientes (Acceso Libre)
* **Landing Principal:** `http://localhost:5173/`
* **Cotizador Oficial:** `http://localhost:5173/cotizar`
* **Pre-registro de Pedido Web:** `http://localhost:5173/registrar-pedido`
* **Confirmación de Pre-orden:** `http://localhost:5173/pedido-exitoso/:tracking`
* **Rastreo de Envíos en Tiempo Real:** `http://localhost:5173/tracking` o `http://localhost:5173/tracking/:codigo`

### B. Portal de Autenticación y Seguridad
* **Inicio de Sesión (Login):** `http://localhost:5173/auth/login`
* **Verificación de Segundo Factor (2FA TOTP):** `http://localhost:5173/auth/2fa`
* **Solicitar Recuperación de Contraseña:** `http://localhost:5173/auth/recuperar-password`
* **Restablecer Contraseña (Token de URL):** `http://localhost:5173/auth/restablecer-password?token=...`

### C. Intranet Administrativa y Operativa (`/admin/*`)
> Requiere sesión iniciada con token JWT válido. El menú lateral y accesos directos se adaptan al rol del usuario autenticado:

* **Tablero Central (Dashboard):** `http://localhost:5173/admin/dashboard`
* **Gestión de Envíos:** `http://localhost:5173/admin/envios`
* **Ficha Técnica y Entrega Final:** `http://localhost:5173/admin/envios/:id` *(Incluye modal para registrar entrega física con DNI)*
* **Recepción en Balanza (Caja/Ventanilla):** `http://localhost:5173/admin/caja/recepcion` *(Pesaje, recálculo y cobro)*
* **Caja Chica y Turnos:** `http://localhost:5173/admin/caja`
* **Despacho a Ruta (Almacén Origen):** `http://localhost:5173/admin/almacen/despacho` *(Carga a camión y paso a `en_ruta`)*
* **Arribo y Descarga (Almacén Destino):** `http://localhost:5173/admin/almacen/arribos` *(Descarga de camión y paso a `en_agencia_destino`)*
* **Stock de Almacén:** `http://localhost:5173/admin/almacen`
* **Directorio de Clientes:** `http://localhost:5173/admin/clientes`
* **Directorio de Agencias:** `http://localhost:5173/admin/agencias`
* **Administración de Personal (RBAC):** `http://localhost:5173/admin/usuarios` *(Solo rol Administrador)*
* **Guías de Remisión Electrónicas:** `http://localhost:5173/admin/guias`
* **Manifiestos de Carga:** `http://localhost:5173/admin/manifiestos`
* **Courier y Repartos a Domicilio:** `http://localhost:5173/admin/courier`
