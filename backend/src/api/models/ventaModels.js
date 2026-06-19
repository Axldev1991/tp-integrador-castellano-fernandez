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

export default {
    registrarVenta
};