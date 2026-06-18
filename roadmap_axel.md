# 📋 Roadmap de Tareas - Responsable: Axel

Este documento detalla las tareas asignadas a Axel para el TP Integrador "Autoservicio".

---

## 🏗️ Etapa 1: Setup & Arquitectura (Completado)
- [x] **1.1.** Estructura base del repositorio (`backend/` y `frontend/`).
- [x] **1.2.** Inicialización de Node.js, dependencias y `.gitignore`.
- [x] **1.3.** Servidor Express base con logger, cors, y json middlewares.
- [x] **1.4.** Configuración de EJS (`view engine`) y carpeta `views/`.

## 🗄️ Etapa 2: Base de Datos
- [x] **2.1.** Conexión de base de datos MySQL/MariaDB (Pool de conexiones).
- [x] **2.2.** Diseño e inyección del archivo `schema.sql` (tablas productos, ventas, usuarios, ventas_productos).

## 🔐 Etapa 3: Back-Office Administrativo (Backend - EJS)
- [x] **3.1. Pantalla de Login (`/admin/login`)**:
  - Formulario de inicio de sesión con validación de credenciales en la base de datos.
  - Botón de Acceso Rápido para autocompletar usuario de prueba con un clic.
- [x] **3.3. Alta de Producto (`/admin/productos/nuevo`)**:
  - Formulario para cargar datos y subida de imagen física al servidor usando `multer`.
- [x] **3.3. Modificación de Producto (`/admin/productos/editar/:id`)**:
  - Interfaz de edición precargada con opción de actualizar la imagen.

## 📱 Etapa 4: Frontend del Cliente (Autoservicio)
- [x] **4.2.3. Gestión del Carrito**:
  - Lógica del carrito en JS (agregar, modificar cantidades, y eliminar).
- [x] **4.2.4. Confirmación de Compra**:
  - Modal de confirmación y envío de datos a la API (`POST /api/ventas`).
- [x] **4.2.5. Pantalla de Ticket**:
  - Mostrar detalle de lo comprado y botón para descargar el ticket en PDF.
- [x] **4.2.6. Reinicio de Flujo**:
  - Botón "Salir" que limpia el estado y redirige a la bienvenida.


## 🔌 Integración y Conexión Backend-Frontend (Nuevas Tareas)
- [x] **I.1. Endpoints de Cliente en Backend**: Implementar las rutas y controladores para `GET /api/productos` (productos activos de la base de datos) y `POST /api/ventas` (registro de venta y detalle en la BD).
- [x] **I.2. Integrar Catálogo Dinámico**: Reemplazar los productos hardcodeados en `productos.html` por un `fetch` dinámico al backend.
- [x] **I.3. Integrar Registro de Compras**: Descomentar y conectar la función `confirmarCompra()` en `carrito_actions.js` para enviar la venta a la API mediante `POST`.


## 🎓 Requerimientos de Final (Adicionales)
- [x] **E.1.** Redirección obligatoria a Encuesta al hacer clic en Salir del ticket.
- [x] **E.2.** Formulario de Encuesta con 5 tipos de inputs (textarea, email, checkbox, slider, file).
- [x] **E.3.** Validaciones de encuesta, opción "Omitir", modal de agradecimiento e inserción en base de datos.
- [ ] **E.4.** Pantalla de Detalle de Producto por ID (`/productos/:id`).


