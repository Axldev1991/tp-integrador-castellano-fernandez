import connection from "../database/db.js";

//funcion de nuestra API-Cliente que le va a devolver todos los productos al cliente
export const getProductos = async (req, res) => {
    try{
        const activo = true;
        const [rows] = await connection.query("SELECT id, nombre, precio, imagenUrl, categoria FROM productos WHERE activo = ?", [activo]);
        
        //Este quilombo es gracias a Saulo que se cagó en el español que manejamos en la DB
        const productosMapeados = rows.map(prod => {
            return {
                id: prod.id,
                name: prod.nombre,
                price: parseFloat(prod.precio),
                // Si la imagen ya tiene http no le agregamos nada, sino le ponemos el host del backend
                image: prod.imagenUrl.startsWith('http') ? prod.imagenUrl : `http://localhost:3000${prod.imagenUrl}`,
                type: prod.categoria === 'Pantalones' ? 'oferta' : 'normal'
            };
        });
        return res.json({
            payload: productosMapeados,
            total: productosMapeados.length
        });
        
    }catch(error){
        console.error("Error obteniendo productos:", error);
        res.status(500).json({error: error.message});
    }
}

//funcion de nuestra API-Cliente en donde vamos a registrar una venta exitosa
export const postVenta = async (req, res) => {
    const conn = await connection.getConnection();//reserva una conexion exclusiva del pool de conexiones que creamos.

    try{
        await conn.beginTransaction();//esta es una "transaccion", todo lo que insertemos en la base de datos va a ser TEMPORAL hasta que indiquemos que haga efectivo el insert (evitamos guardar una venta por la mitad)
        const {cliente, total, items} = req.body;

        const [result] = await conn.query(
            "INSERT INTO ventas (nombreCliente, precioTotal) VALUES (?, ?)", [cliente, total]
        )//insertamos la venta, y nos devuelve el ID del insert que acabamos de hacer en la DB de ventas

        const ventaId = result.insertId;

        for(const item of items){
            await conn.query(
                "INSERT INTO ventas_productos (venta_id, producto_id, cantidad, precioUnitario) VALUES (?, ?, ?, ?)", [ventaId, item.id, item.cantidad, item.precio_unitario]
            )
        }//no podemos usar forEach, porque es SINCRONO, entonces nos traba el flujo del programa. Registramos cada uno de los productos que compró el cliente

        await conn.commit(); //si la función llegó hasta acá sin errores, se hacen efectivos los inserts en la DB

        return res.status(201).json({
            status: "success",
            message: "¡Venta registrada con éxito!"
        });

    }catch(error){
        await conn.rollback(); //esto vuelve para atrás todos los insert "temporales" del bloque try, si es que tuvimos algún error con la conexión
        console.error("Error al registrar venta:", error);
        res.status(500).json({error: error.message});
    }finally{
        conn.release()//devuelve la conexion exclusiva del pool del conexiones de la DB
    }
}

//funcion API-Cliente para insertar en la DB la encuesta
export const postEncuesta = async (req, res) => {
    const { email, puntuacion, recomienda, opinion } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email || !emailRegex.test(email)){
        return res.status(400).json({error: "Ingrese un email válido"})
    }//validamos el mail
    
    const nota = parseInt(puntuacion);
    if(isNaN(nota) || nota < 1 || nota > 10){
        return res.status(400).json({error: "Ingrese una puntuación entre 1 y 10"})
    }//validamos la puntuacion dentro de los rangos

    try{
        const recomiendaNum = recomienda === "1" ? 1: 0;//convertimos la puntuacion a int
        const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null;//verificamos si subió un archivo o no

        const response = await connection.query("INSERT INTO encuestas (cliente_email, opinion, recomienda, puntuacion, archivoUrl) VALUES (?, ?, ?, ?, ?)", [email, opinion, recomiendaNum, nota, archivoUrl]);

        return res.status(201).json({
            status: "success",
            message: "¡Muchas gracias por completar la encuesta!"
        });

    }catch(error){
        console.error("Error al guardar encuesta:", error);
        res.status(500).json({error: error.message});
    }
}

export const getProdDescripcion = async (req, res) => {
    const id = req.id;
    const activo = true;
    
    try{
        const [rows] = await connection.query("SELECT id, nombre, descripcion, precio, imagenUrl, categoria FROM productos WHERE id = ? AND activo = ?", [id,activo]);

        if(rows.length === 0){
            return res.status(404).json({error: "No existe el producto"});
        }

        const prod = rows[0];

        const productoMapeado = {
            id: prod.id,
            name: prod.nombre,
            description: prod.descripcion,
            price: parseFloat(prod.precio),
            image: prod.imagenUrl.startsWith('http') ? prod.imagenUrl : `http://localhost:3000${prod.imagenUrl}`,
            category: prod.categoria
        };

        return res.json({payload: productoMapeado});

    }catch(error){
        console.error(error);
        res.status(500).json({ error: error.message })
    }


};