import connection from "../database/db.js";

//creamos los modelos para las consultas SQL, de esta forma si mañana cambiamos la base de datos, no tenemos que cambiar todas las consultas en cada uno de los archivos

//todos los productos activo=true
const getProductosActivos = async () => {
    const sql = "SELECT id, nombre, precio, imagenUrl, categoria FROM productos WHERE activo = ?";

    const [rows] = await connection.query(sql, [true]);

    return rows;
};

//buscar productos por id y activo=true
const getProductosId = async (id) =>{
    const sql = "SELECT id, nombre, descripcion, precio, imagenUrl, categoria FROM productos WHERE id = ? AND activo = ?";

    const [rows] = await connection.query(sql, [id, true]);

    return rows;
};

const getProductosDashboard = async () =>{
    const sql = "SELECT id, nombre, precio FROM productos";

    const [productos] = await connection.query(sql)

    return productos;
};

const postNuevoProducto = async ({nombre, descripcion, precio, imageUrl, categoria}) =>{
    const sql = "INSERT INTO productos (nombre, descripcion, precio, imagenUrl, categoria) VALUES (?, ?, ?, ?, ?)";

    await connection.query(sql, [nombre, descripcion, precio, imageUrl, categoria])
};

const getProductoIdAdmin = async (id) => {
    const sql = "SELECT * FROM productos WHERE id = ?";

    const [rows] = await connection.query(sql, [id]);

    return rows[0];
};

const actualizarProducto = async ({ id, nombre, descripcion, precio, categoria, imageUrl }) => {
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


export default {
    getProductosActivos,
    getProductosId,
    getProductosDashboard,
    postNuevoProducto,
    getProductoIdAdmin,
    actualizarProducto
}