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

export default {
    getProductosActivos,
    getProductosId
}