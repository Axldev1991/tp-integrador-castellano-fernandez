import bcrypt from "bcrypt";
import userModels from "../models/userModels.js";
import productModels from "../models/productModels.js";

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

/*
endpoint TEMPORAL para mostrar el dashboard
*/
export const getDashboard = async (req, res) => {
    try{
        const productos = await productModels.getProductosDashboard();

        // Armamos un HTML básico
        let html = "<h1>Dashboard Temporal (Axel & Saulo)</h1>";
        html += "<p><a href='/admin/productos/nuevo'>+ Crear Nuevo Producto</a></p>";
        html += "<ul>";
        
        // Iteramos los productos para armar la lista
        productos.forEach(prod => {
            html += `<li>
                <strong>${prod.nombre}</strong> - $${prod.precio} 
                | <a href="/admin/productos/editar/${prod.id}">Editar</a>
            </li>`;
            //acá construimos la URL para el getEditarProducto
        });
        
        html += "</ul>";
        
        // Respondemos al cliente con el HTML armado
        res.send(html);

    }catch(error){
        console.error("Error en dashboard temporal:", error);
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
export const postNuevoProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        await productModels.postNuevoProducto({ nombre, descripcion, precio, imageUrl, categoria });

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Error al crear producto nuevo:", error);
        res.status(500).send("Error interno al crear el producto");
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
