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
- [x] **E.4.** Pantalla de Detalle de Producto por ID (`/productos/:id`).

## ⚡ Optimizaciones de la Cátedra (Pendientes)
- [x] **O.1. Limitar campos en consultas SQL:** Reemplazar los `SELECT *` por la selección explícita de campos (`SELECT id, nombre, precio...`) en las consultas de la API y de administración para cuidar el ancho de banda y memoria.
- [x] **O.2. Middleware de validación de IDs (`validateId`):** Implementar un middleware que limpie y valide que los IDs recibidos en los parámetros de ruta sean números enteros positivos antes de consultar la base de datos, retornando `400 Bad Request` si no lo son.
- [x] **O.3. Estandarización de respuestas con `payload`:** Envolver las respuestas JSON del backend que devuelven colecciones o recursos bajo la propiedad `payload` (para alinearse con el formato del profe y su bitácora).

## 🏛️ Refactorización Arquitectónica (Patrón MVC - Pendiente)
- [x] **R.1. Separación de la Capa de Modelos (Models):** Extraer todas las consultas SQL directas (`connection.query`) de los controladores (`apiController.js` y `adminController.js`) hacia sus respectivos modelos dentro de `src/api/models/` para cumplir con el Principio de Responsabilidad Única (SRP).



  - *Lugares a modificar en el Backend:*
    - [apiController.js:L20](file:///home/axel/Escritorio/UTN/programacion3-tpIntegrador/backend/src/api/controllers/apiController.js#L20) en `getProductos` (cambiar `res.json(productosMapeados)` por `{ payload: productosMapeados, total: productosMapeados.length }`).
  - *Lugares a modificar en el Frontend (para no romper la UI al cambiar la API):*
    - En los archivos JS del frontend donde se haga `fetch` a `/api/productos` (por ejemplo, en el catálogo para iterar sobre `data.payload` en vez de `data` directamente).




