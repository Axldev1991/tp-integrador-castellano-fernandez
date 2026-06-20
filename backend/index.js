/*
MIDDLEWARE: Es una función intermedia que se ejecuta en el servidor Express desde que llega la petición del cliente (request) hasta que se envía la respuesta final (response). Sirve para inspeccionar, transformar, validar o bloquear esa petición.

- express: framework que nos ayuda a crear el servidor web. Se encarga de escuchar las peticiones del navegador (GET, POST), decidir qué función ejecutar según la URL, y enviarle la respuesta al cliente (un HTML renderizado, un JSON o una redirección).

- cors: middleware de seguridad que permite que el frontend y el backend se comuniquen cuando están en diferentes puertos u orígenes (por ejemplo, si el cliente corre en el puerto 5173 y la API de Express en el 3000).
*/

import express from "express";
import cors from "cors";
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import session from "express-session";
import path from "path";

import { validateID } from "./src/api/middlewares/validators.js";

import adminRoutes from "./src/api/routes/admin.routes.js";
import productosRoutes from "./src/api/routes/productos.routes.js";
import encuestasRoutes from "./src/api/routes/encuestas.routes.js";
import ventasRoutes from "./src/api/routes/ventas.routes.js";


const app = express(); // guardamos el objeto express
const PORT = environments.port; //guardamos el puerto desde environments

/* 
Le dice a Express que cada vez que usemos el método res.render("archivo"), busque un archivo con extensión .ejs dentro de la carpeta por defecto, que es /views. */
app.set("view engine", "ejs"); 

//esto permite a express utilizar cors para poder intercomunicar puertos, o el frontend con el backend, es un middleware de seguridad
app.use(cors());

//parsea a JSON la respuesta obtenida desde el FRONT y te lo convierte a objeto JS, luego lo vamos a utilizar con req.body.KEY
app.use(express.json());

/*
middleware para leer formularios: recibe los datos de un formulario y los encripta y luego los transforma a objeto para usar con req.body
*/
app.use(express.urlencoded({extended: true}));

/*
middleware de sesión:
- Crea una sesión (ficha) en el servidor para el usuario y le da una cookie con su ID.
- secret: Firma digital para que el cliente no pueda falsificar su cookie de sesión.
- resave: Evita guardar la sesión en cada petición si no hubo cambios.
- saveUninitialized: No crea sesiones para usuarios que no se han logueado.
- cookie (maxAge): Tiempo que dura la cookie viva en el navegador (10 minutos).
*/
app.use(session({
    secret: environments.sessionSecret, 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 600000 } 
}));

/*
creamos un middleware para leer los archivos de la carpeta public(css, imagenes, etc)
*/
app.use(express.static("public"));

//le permitimos a express poder ver el front en el puerto del localhost configurado
app.use(express.static("../frontend"));

/*
- el servidor escucha peticiones (GET) cuando se escribe la URL en el navegador.
- "/" es la raiz del servidor
- res.send: mandamos un mensaje al navegador desde el servidor
*/
app.get("/", (req,res) => {
    res.send("Servidor de Autoservicio corriendo de diez")
});

/*
- Ahora el servidor escucha el GET para /test-db
- funcion async: para esperar a que la base de datos responda
- try/catch: para evitar cualquier error de la base de datos y que no se caiga el servidor
- await: obligatorio al usar async
- connection.query: devuelve un array con 2 posiciones(conection viene del import de nuestro db.js, .query del import de mysql2)
- [rows]: destructuramos el array, nos quedamos con el resultado de la consulta sql en la posicion 0 del array, el otro lo descartamos (son metadatos de la consulta/tabla) 
*/
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT 1 + 1 AS result");
        res.json({
            status: "success",
            message: "¡Conexión a MariaDB exitosa!",
            result: rows[0].result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error de conexión a la base de datos",
            error: error.message
        });
    }
});

// Rutas del panel administrativo montadas bajo "/admin"
app.use("/admin", adminRoutes);

//Rutas de nuestra API
// app.use("/api", apiRouter);
app.use('/api/productos', productosRoutes);

app.use('/api/encuestas', encuestasRoutes);

app.use('/api/ventas', ventasRoutes);

// Ruta para la página de detalle del producto
app.get("/productos/:id", validateID, (req, res) => {
    res.sendFile(path.resolve("../frontend/pages/detalle.html")); // la ruta correcta del archivo
});


/*
.listen: metodo de express que abre el puerto especificado en el servidor, y escucha cualquier conexion de red entrante
*/
app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);   
});
