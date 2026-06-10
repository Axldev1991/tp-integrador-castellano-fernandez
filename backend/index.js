/*
MIDDLEWARE: Es una función intermedia que se ejecuta en el servidor Express desde que llega la petición del cliente (request) hasta que se envía la respuesta final (response). Sirve para inspeccionar, transformar, validar o bloquear esa petición.

- express: framework que nos ayuda a crear el servidor web. Se encarga de escuchar las peticiones del navegador (GET, POST), decidir qué función ejecutar según la URL, y enviarle la respuesta al cliente (un HTML renderizado, un JSON o una redirección).

- cors: middleware de seguridad que permite que el frontend y el backend se comuniquen cuando están en diferentes puertos u orígenes (por ejemplo, si el cliente corre en el puerto 5173 y la API de Express en el 3000).

- multer: middleware que recibe y procesa archivos binarios (como imágenes). Guarda el archivo en el disco y le pasa a Express la ruta de texto donde quedó guardado en req.file.
*/

import express from "express";
import cors from "cors";
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import session from "express-session";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";


/*
- const storage: definimos las reglas para almacenarlo
- const upload: el middleware que se encarga de capturar en el momento que un formulario envía una imagen
*/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/"); // Carpeta destino
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único: timestamp + extensión original (.jpg, .png, etc)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Inicializamos el middleware
const upload = multer({ storage: storage });


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
- try/catch: para evitar calquier error de la base de datos y que no se caiga el servidor
- await: obligatorio al usar async
- connection.query: devuelve un array con 2 posiciones(conection viene del import de nuestro db.js, .query del import de mysql2)
- [rows]: destructuramos el array, nos quedamos con el resultado de la consulta sql en la posicion 0 del array, el otro lo descartamos (son metadados de la consulta/tabla) 

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

/*
- endpoint para cargar en formato HTML el login de usuario
- sabe que tiene que ir a buscarlo a /views por el app.set que hicimos al principio de este archivo
*/
app.get("/admin/login", (req, res) => {
    res.render("login");
});

/*
- Endpoint para mostrar el formulario de carga de un nuevo producto
*/
app.get("/admin/productos/nuevo", (req, res) => {
    res.render("nuevo-producto");
});

/*
- Endpoint para interceptar cuando enviamos un archivo al servidor.

*/
app.post("/admin/productos/nuevo", upload.single("imagen"), async (req, res) => {
    try{
        const {nombre, descripcion, precio, categoria} = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        await connection.query(
            "INSERT INTO productos (nombre, descripcion, precio, imagenUrl, categoria) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, precio, imageUrl, categoria]
        );

        res.redirect("/admin/dashboard");


    }catch(error){
        console.log(error)
    }
});


/*
- endpoint en donde hacemos un post al servidor pidiendolé si el usuario existe en la DB, para eso desestructuramos el correo y la contraseña atrapadas con el middleware "express.urlencoded".
- .query hace la petición a la base de datos, y nos devuelve todo el objeto usuario o undefined
*/
app.post("/admin/login", async (req, res) => {
    const {correo, contrasena} = req.body;

    try{
        const [rows] = await connection.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
        const usuario = rows[0];
        if (usuario === undefined){
            return res.render("login", { error: "El correo electrónico no existe." }); //renderizamos en la misma página el error porque el usuario ingresado no existe

        }else if (usuario){
            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena); //validamos la contraseña

            if(!contrasenaValida){
                return res.render("login", {error: "contraseña incorrecta"});
            }

            req.session.usuario = {
                id: usuario.id,
                correo: usuario.correo
            }//usamos el middleware session para guardar los datos del usuario
            res.redirect("/admin/dashboard");

        }
    }catch(error){
        console.log(error);
    }
});



/*
.listen: metodo de express que abre el puerto especificado en el servidor, y escucha cualquier conexion de red entrante
*/
app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);   
});

