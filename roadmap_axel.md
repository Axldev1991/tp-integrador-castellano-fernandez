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
- [ ] **3.3. Alta de Producto (`/admin/productos/nuevo`)**:
  - Formulario para cargar datos y subida de imagen física al servidor usando `multer`.
- [ ] **3.3. Modificación de Producto (`/admin/productos/editar/:id`)**:
  - Interfaz de edición precargada con opción de actualizar la imagen.

## 📱 Etapa 4: Frontend del Cliente (Autoservicio)
- [ ] **4.2.3. Gestión del Carrito**:
  - Lógica del carrito en JS (agregar, modificar cantidades, y eliminar).
- [ ] **4.2.4. Confirmación de Compra**:
  - Modal de confirmación y envío de datos a la API (`POST /api/ventas`).
- [ ] **4.2.5. Pantalla de Ticket**:
  - Mostrar detalle de lo comprado y botón para descargar el ticket en PDF.
- [ ] **4.2.6. Reinicio de Flujo**:
  - Botón "Salir" que limpia el estado y redirige a la bienvenida.

## 🎓 Requerimientos de Final (Adicionales)
- [ ] **E.1.** Redirección obligatoria a Encuesta al hacer clic en Salir del ticket.
- [ ] **E.2.** Formulario de Encuesta con 5 tipos de inputs (textarea, email, checkbox, slider, file).
- [ ] **E.3.** Validaciones de encuesta, opción "Omitir", modal de agradecimiento e inserción en base de datos.
- [ ] **E.4.** Pantalla de Detalle de Producto por ID (`/productos/:id`).
