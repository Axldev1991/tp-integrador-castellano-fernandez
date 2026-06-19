# 📋 Roadmap de Tareas - Responsable: Saulo

Este documento detalla las tareas asignadas a Saulo para el TP Integrador "Autoservicio".

---

## 🗄️ Etapa 2: API JSON (Backend)
- [ ] **2.3. Endpoints API JSON (Respuestas en formato JSON)**:
  - [ ] `POST /api/admin/setup` (registro de usuario admin encriptado).
  - [x] `GET /api/productos` (catálogo paginado de productos activos) - *Implementado por Axel*.
  - [x] `GET /api/productos/:id` (detalle del producto) - *Implementado por Axel*.
  - [x] `POST /api/ventas` (registro de una venta en base de datos) - *Implementado por Axel*.
  - [ ] `GET /api/ventas` (historial de ventas con productos - Eager Loading).
- [ ] **2.4. Middlewares de Validación**:
  - Validar datos obligatorios, formatos de email y precios positivos en peticiones POST/PUT.

## 🔐 Etapa 3: Back-Office Administrativo (Backend - EJS)
- [ ] **3.2. Dashboard de Administración (`/admin/dashboard`)**:
  - Vista protegida por middleware de sesión.
  - Tabla de productos agrupada por categorías mostrando si están Activos o Inactivos.
- [ ] **3.3. Baja Lógica de Productos**:
  - Botón para desactivar producto (activo a false en BD) con modal de confirmación.
- [ ] **3.3. Reactivación de Productos**:
  - Botón para activar producto inactivo (activo a true en BD) con modal de confirmación.
- [ ] **3.4. Exportar a Excel**:
  - Botón para descargar el historial de ventas en formato `.xlsx` usando la librería `xlsx`.

## 📱 Etapa 4: Frontend del Cliente (Autoservicio)
- [ ] **Favicon:** Configurar el favicon de la marca (favicon.ico / logo_tienda.png) en todas las cabeceras HTML para cumplir con la restricción obligatoria R.1 del PDF.
- [x] **4.1. Estilos y Temas**:
  - CSS moderno con variables para Tema Claro y Oscuro.
  - Switch de cambio de tema con persistencia en `localStorage`.
- [x] **4.2.1. Pantalla de Bienvenida**:
  - Input para ingresar nombre del cliente y validación para avanzar.
- [x] **4.2.2. Catálogo de Productos**:
  - Renderizar productos activos ordenados por categoría, controles de cantidad y descripción.

## 🎓 Requerimientos de Final (Adicionales)
- [ ] **E.5. Registros y Auditoría**:
  - Nueva sección de auditoría en el panel de auditoría.
- [ ] **E.6. Sistema de Logs**:
  - Registrar en base de datos logins de administradores exitosos (fecha, hora, usuario).
- [ ] **E.7. Monitoreo de Logs**:
  - Visualizar listado de logs desde el panel de auditoría.
- [ ] **E.8. Estadísticas**:
  - Mostrar Top 10 más vendidos, Top 10 ventas más caras y al menos dos métricas de negocio extra.
- [ ] **E.9. Descarga de Encuestas**:
  - Botón para exportar todas las encuestas respondidas a formato `.xlsx`.

## ⚡ Modularización y Limpieza (Completado por Saulo)
- [x] **M.1. Modularización de la API Cliente:** Dividir el controlador gigante y las rutas en archivos separados por recurso (productos, ventas, encuestas) para mejorar la escalabilidad del backend.
- [x] **M.2. Modularización del Layout del Frontend:** Separar las cabeceras, pies de página y lógica de sesión en archivos reusables (`load_components.js` y `verificar_sesion.js`) y limpiar las páginas HTML.


