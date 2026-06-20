import bcrypt from "bcrypt";
import userModels from "../models/user.models.js";
import productModels from "../models/producto.models.js";
import ventaModels from "../models/venta.models.js";

/*
- endpoint para cargar en formato HTML el login de usuario
- sabe que tiene que ir a buscarlo a /views por el app.set que hicimos al principio de este archivo
*/
export const getLogin = (req, res) => {
    res.render("login");
};

/*
- endpoint en donde hacemos un post al servidor pidiendolé si el usuario existe en la DB, para eso desestructuramos el correo y la contraseña atrapadas con el middleware "express.urlencoded".
- .query hace la petición a la base de datos, y nos devuelve todo el objeto usuario o undefined
*/
export const postLogin = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await userModels.getUsuarioEmail(correo);
        
        if (usuario === undefined) {
            return res.render("login", { error: "El correo electrónico no existe." }); //renderizamos en la misma página el error porque el usuario ingresado no existe
        } else if (usuario) {
            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena); //validamos la contraseña

            if (!contrasenaValida) {
                return res.render("login", { error: "contraseña incorrecta" });
            }

            req.session.usuario = {
                id: usuario.id,
                correo: usuario.correo
            }; //usamos el middleware session para guardar los datos del usuario
            res.redirect("/admin/dashboard");
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).send("Error interno del servidor");
    }
};


export const getRegister = (req, res) => {
    res.render("register", {
        error: null,
        success: null,
        nombre: '',
        correo: ''
    });
};

export const postRegister = async (req, res) => {
    const { nombre, correo, contrasena, confirmar_contrasena } = req.body;

    try {
        // 1. Validar que las contraseñas coincidan
        if (contrasena !== confirmar_contrasena) {
            return res.render("register", { 
                error: "Las contraseñas no coinciden",
                nombre,
                correo
            });
        }

        // 2. Validar que la contraseña tenga mínimo 6 caracteres
        if (contrasena.length < 6) {
            return res.render("register", { 
                error: "La contraseña debe tener al menos 6 caracteres",
                nombre,
                correo
            });
        }

        // 3. Verificar si el email ya existe
        const usuarioExistente = await userModels.getUsuarioEmail(correo);
        if (usuarioExistente) {
            return res.render("register", { 
                error: "El correo electrónico ya está registrado",
                nombre,
                correo
            });
        }

        // 4. Hashear la contraseña
        const saltRounds = 10;
        const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

        // 5. Guardar el usuario en la base de datos
        // NOTA: Necesitas agregar esta función en user.models.js
        const nuevoUsuario = await userModels.createUsuario({
            nombre,
            correo,
            contrasena: contrasenaHash,
            // Por defecto, el primer usuario registrado es admin
            // Podrías agregar un campo "rol" en la tabla usuarios
            rol: 'admin'
        });

        // 6. Redirigir al login con mensaje de éxito
        res.render("login", { 
            success: "¡Usuario registrado exitosamente! Ahora podés iniciar sesión."
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.render("register", { 
            error: "Error interno del servidor. Intentá de nuevo más tarde.",
            nombre,
            correo
        });
    }
};


export const getHistorialVentas = async (req, res) => {
    try {
        const ventas = await ventaModels.obtenerVentas();
        res.render("historial-ventas", { ventas });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el historial");
    }
};

/*
endpoint TEMPORAL para mostrar el dashboard
*/
export const getDashboard = async (req, res) => {
    try {
        // Obtener productos agrupados por categoría
        const productosAgrupados = await productModels.getProductosAgrupados();
        
        // Obtener estadísticas básicas
        const totalProductos = Object.values(productosAgrupados).reduce(
            (sum, prods) => sum + prods.length, 0
        );
        
        // Contar activos e inactivos
        let activos = 0;
        let inactivos = 0;
        Object.values(productosAgrupados).forEach(prods => {
            prods.forEach(p => {
                if (p.activo === 1 || p.activo === true) {
                    activos++;
                } else {
                    inactivos++;
                }
            });
        });
        
        // Renderizar el dashboard con los datos
        res.render("dashboard", {
            productosAgrupados,
            stats: {
                total: totalProductos,
                activos,
                inactivos
            },
            usuario: req.session.usuario
        });
        
    } catch (error) {
        console.error("Error en dashboard:", error);
        res.status(500).send("Error en el servidor al cargar el dashboard");
    }
};

/*
- Endpoint para mostrar el formulario de carga de un nuevo producto
*/
export const getNuevoProducto = (req, res) => {
    res.render("formulario-producto", { producto: null });
};

/*
- Endpoint para interceptar cuando enviamos un archivo al servidor.
*/
// controllers/admin.controllers.js
export const postNuevoProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        await productModels.postNuevoProducto({ nombre, descripcion, precio, imageUrl, categoria });

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Error al crear producto nuevo:", error);
        res.status(500).render("formulario-producto", {
            producto: { nombre, descripcion, precio, categoria },
            error: "Error interno al crear el producto. Intentá de nuevo."
        });
    }
};

// Agregamos el GET de editar producto para traernos todos los datos de la DB del producto a editar
export const getEditarProducto = async (req, res) => {
    const id = req.id;
    try {
        const producto = await productModels.getProductoIdAdmin(id);
        if (!producto) {
            // Si no existe, redirigimos
            return res.redirect("/admin/dashboard");
        }
        // Renderizamos la misma plantilla de producto nuevo, con los campos completos
        res.render("formulario-producto", { producto });
    } catch (error) {
        console.error("Error al obtener el producto para editar:", error);
        res.status(500).send("Error interno del servidor");
    }
};

/*
Endpoint para enviar al servidor los datos de la edición del producto
*/
export const postEditarProducto = async (req, res) => {
    const id = req.id;
    const { nombre, descripcion, precio, categoria } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await productModels.actualizarProducto({nombre, descripcion, precio, imageUrl, categoria, id});
        
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send("Error interno al actualizar el producto");
    }
};


export const toggleProducto = async (req, res) => {
    const id = req.id;
    try {
        await productModels.estadoProducto(id);
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cambiar estado del producto");
    }
};