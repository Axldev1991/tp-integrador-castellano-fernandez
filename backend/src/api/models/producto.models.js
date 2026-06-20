import connection from "../database/db.js";

//creamos los modelos para las consultas SQL, de esta forma si mañana cambiamos la base de datos, no tenemos que cambiar todas las consultas en cada uno de los archivos

//todos los productos activo=true
export const getProductosActivos = async () => {
    const sql = "SELECT id, nombre, precio, imagenUrl, categoria FROM productos WHERE activo = ?";

    const [rows] = await connection.query(sql, [true]);

    return rows;
};

//buscar productos por id y activo=true
export const getProductosId = async (id) =>{
    const sql = "SELECT id, nombre, descripcion, precio, imagenUrl, categoria FROM productos WHERE id = ? AND activo = ?";

    const [rows] = await connection.query(sql, [id, true]);

    return rows;
};

const getProductosDashboard = async () => {
    const sql = "SELECT id, nombre, descripcion, precio, imagenUrl, categoria, activo FROM productos";
    const [productos] = await connection.query(sql);
    return productos;
};

const getProductosAgrupados = async () => {
    const sql = "SELECT id, nombre, descripcion, precio, imagenUrl, categoria, activo FROM productos ORDER BY categoria, nombre";
    const [productos] = await connection.query(sql);
    
    // Agrupar por categoría
    const agrupados = {};
    productos.forEach(prod => {
        if (!agrupados[prod.categoria]) {
            agrupados[prod.categoria] = [];
        }
        agrupados[prod.categoria].push(prod);
    });
    
    return agrupados;
};

export const postNuevoProducto = async ({nombre, descripcion, precio, imageUrl, categoria}) =>{
    const sql = "INSERT INTO productos (nombre, descripcion, precio, imagenUrl, categoria) VALUES (?, ?, ?, ?, ?)";

    await connection.query(sql, [nombre, descripcion, precio, imageUrl, categoria])
};

export const getProductoIdAdmin = async (id) => {
    const sql = "SELECT * FROM productos WHERE id = ?";

    const [rows] = await connection.query(sql, [id]);

    return rows[0];
};

export const actualizarProducto = async ({ id, nombre, descripcion, precio, categoria, imageUrl }) => {
    if (imageUrl) {
        // Si viene la URL de la imagen, actualizamos todos los campos incluyendo la imagen
        const sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, imagenUrl = ? WHERE id = ?";

        await connection.query(sql, [nombre, descripcion, precio, categoria, imageUrl, id]);

    } else {
        // Si no viene imagenUrl, actualizamos todo MENOS la imagen para mantener la anterior
        const sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ? WHERE id = ?";
        
        await connection.query(sql, [nombre, descripcion, precio, categoria, id]);
    }
};

const estadoProducto = async (id) => {
    const sql = "UPDATE productos SET activo = NOT activo WHERE id = ?";
    await connection.query(sql, [id]);
};


export default {
    getProductosActivos,
    getProductosId,
    getProductosDashboard,
    getProductosAgrupados,
    postNuevoProducto,
    getProductoIdAdmin,
    actualizarProducto,
    estadoProducto
}