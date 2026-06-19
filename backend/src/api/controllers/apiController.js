import productModels from "../models/productModels.js";
import encuestaModels from "../models/encuestaModels.js";
import ventaModels from "../models/ventaModels.js";


//funcion de nuestra API-Cliente que le va a devolver todos los productos al cliente
export const getProductos = async (req, res) => {
    try{
        const rows = await productModels.getProductosActivos();
        
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
    const { cliente, total, items } = req.body;

    try {
        // Llamamos al modelo pasándole los datos limpios
        await ventaModels.registrarVenta({ cliente, total, items });

        return res.status(201).json({
            status: "success",
            message: "Venta registrada con éxito"
        });

    } catch (error) {
        console.error("Error al registrar venta en controlador:", error);
        res.status(500).json({ error: error.message });
    }
};


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

        const response = await encuestaModels.postEncuesta({
            email,
            opinion,
            recomienda: recomiendaNum, 
            nota,
            archivoUrl
        });

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
    
    try{
        const rows = await productModels.getProductosId(id);

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