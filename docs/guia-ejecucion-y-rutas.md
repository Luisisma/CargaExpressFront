# Guía de Ejecución y Despliegue Local del Frontend

Esta guía detalla las herramientas instaladas previamente y los comandos necesarios para levantar y visualizar el proyecto cliente **CargaExpressFront**.

---

## 1. Dependencias y Paquetes Instalados Previamente

El proyecto fue inicializado con **Vite** sobre **React 19** y utiliza **Bootstrap 5** junto a su ecosistema de iconos para mantener total fidelidad visual con el sistema monolítico original:

* **Framework base:** `react` y `react-dom`
* **Empaquetador y DevServer:** `vite` y `@vitejs/plugin-react`
* **Navegación declarativa:** `react-router-dom`
* **Diseño y estilos:** `bootstrap` (v5)
* **Iconografía:**
  * `bootstrap-icons` (iconografía idéntica a las plantillas Jinja2)
  * `lucide-react` (iconos complementarios)
* **Calidad de código:** `eslint`

---

## 2. Comandos para Levantar el Frontend

Abre tu terminal en la carpeta del frontend y ejecuta:

```powershell
# 1. Entrar a la carpeta del proyecto
cd c:\Users\User\Documents\VSC-Integrador\CargaExpressFront

# 2. Levantar el servidor de desarrollo Vite
npm run dev
```

Una vez que Vite inicie, verás en la consola:
```text
  VITE ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en: [http://localhost:5173/](http://localhost:5173/)

---

## 3. Comandos Útiles Disponibles

* `npm run dev`: Inicia el servidor de desarrollo con recarga en caliente (*Hot Module Replacement*).
* `npm run build`: Compila los archivos y genera los bundles estáticos de producción en la carpeta `dist/`.
* `npm run preview`: Previsualiza la compilación final generada en `dist/` localmente.
* `npm run lint`: Ejecuta el análisis estático de código con ESLint.

---

## 4. Mapa de Navegación para Visualizar las Vistas (*Views*)

Una vez corriendo el servidor en `http://localhost:5173/`, puedes acceder a los flujos:

### Vistas Públicas
* **Inicio (Landing corporativa):** `http://localhost:5173/`
* **Cotizador de Encomiendas:** `http://localhost:5173/cotizar`
* **Registrar Pedido Público:** `http://localhost:5173/registrar-pedido`
* **Rastreo de Envíos en Tiempo Real:** `http://localhost:5173/tracking` o `http://localhost:5173/tracking/CE2026070001`

### Vistas de Autenticación
* **Portal Colaborador (Login):** `http://localhost:5173/auth/login`
* **Verificación de 2FA (TOTP):** `http://localhost:5173/auth/2fa`

### Vistas del Panel Administrativo
* **Dashboard Operativo:** `http://localhost:5173/admin/dashboard`
* **Gestión de Envíos / Encomiendas:** `http://localhost:5173/admin/envios`
* **Ficha de Envío:** `http://localhost:5173/admin/envios/1`
* **Caja:** `http://localhost:5173/admin/caja`
* **Almacén:** `http://localhost:5173/admin/almacen`
* **Guías de Remisión:** `http://localhost:5173/admin/guias`
* **Manifiestos de Carga:** `http://localhost:5173/admin/manifiestos`
* **Courier (Última Milla):** `http://localhost:5173/admin/courier`
* **Agencias:** `http://localhost:5173/admin/agencias`
* **Clientes:** `http://localhost:5173/admin/clientes`
* **Usuarios:** `http://localhost:5173/admin/usuarios`

*(Nota: En el panel administrativo dispones de un menú selector en la parte inferior del sidebar para cambiar de rol entre Administrador, Cajero, Almacén y Courier).*
