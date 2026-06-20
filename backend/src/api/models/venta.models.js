import connection from "../database/db.js";

const registrarVenta = async ({ cliente, total, items }) => {
    const conn = await connection.getConnection(); //reserva una conexion exclusiva del pool de conexiones que creamos.

    try {
        await conn.beginTransaction(); //esta es una "transaccion", todo lo que insertemos en la base de datos va a ser TEMPORAL hasta que indiquemos que haga efectivo el insert (evitamos guardar una venta por la mitad)

        const sql = "INSERT INTO ventas (nombreCliente, precioTotal) VALUES (?, ?)";

        const [result] = await conn.query(sql, [cliente, total]); //insertamos la venta, y nos devuelve el ID del insert que acabamos de hacer en la DB de ventas

        const ventaId = result.insertId;

        for (const item of items) {
            await conn.query(
                "INSERT INTO ventas_productos (venta_id, producto_id, cantidad, precioUnitario) VALUES (?, ?, ?, ?)", 
                [ventaId, item.id, item.cantidad, item.precio_unitario]
            );
        } //no podemos usar forEach, porque es SINCRONO, entonces nos traba el flujo del programa. Registramos cada uno de los productos que compró el cliente

        await conn.commit(); //si la función llegó hasta acá sin errores, se hacen efectivos los inserts en la DB
        return ventaId;

    } catch (error) {
        await conn.rollback(); //esto vuelve para atrás todos los insert "temporales" del bloque try, si es que tuvimos algún error con la conexión
        console.error("Error al registrar venta en modelo:", error);
        throw error;
        
    } finally {
        conn.release(); //devuelve la conexion exclusiva del pool del conexiones de la DB
    }
};

const obtenerVentas = async () => {
    try {
        // 1. Obtener todas las ventas
        const [ventas] = await connection.query(
            "SELECT id, nombreCliente, precioTotal, fecha FROM ventas ORDER BY fecha DESC"
        );

        // 2. Por cada venta, obtener sus productos
        for (const venta of ventas) {
            const [productos] = await connection.query(
                `SELECT vp.cantidad, vp.precioUnitario, p.nombre as productoNombre
                 FROM ventas_productos vp
                 JOIN productos p ON vp.producto_id = p.id
                 WHERE vp.venta_id = ?`,
                [venta.id]
            );
            venta.productos = productos;
        }

        return ventas;

    } catch (error) {
        console.error("Error al obtener ventas:", error);
        throw error;
    }
};

const obtenerVentaById = async (id) => {
    try {
        // 1. Obtener la venta
        const [ventas] = await connection.query(
            "SELECT id, nombreCliente, precioTotal, fecha FROM ventas WHERE id = ?",
            [id]
        );

        if (ventas.length === 0) {
            return null;
        }

        const venta = ventas[0];

        // 2. Obtener los productos de esa venta
        const [productos] = await connection.query(
            `SELECT vp.cantidad, vp.precioUnitario, p.nombre as productoNombre
             FROM ventas_productos vp
             JOIN productos p ON vp.producto_id = p.id
             WHERE vp.venta_id = ?`,
            [id]
        );

        venta.productos = productos;
        return venta;

    } catch (error) {
        console.error("Error al obtener venta por ID:", error);
        throw error;
    }
};

export default {
    registrarVenta,
    obtenerVentas,
    obtenerVentaById
};