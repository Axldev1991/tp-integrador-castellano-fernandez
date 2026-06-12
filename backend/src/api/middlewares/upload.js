/*
- multer: middleware que recibe y procesa archivos binarios (como imágenes). Guarda el archivo en el disco y le pasa a Express la ruta de texto donde quedó guardado en req.file.
- const storage: definimos las reglas para almacenarlo
- const upload: el middleware que se encarga de capturar en el momento que un formulario envía una imagen
*/

import multer from "multer";
import path from "path";

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
export const upload = multer({ storage: storage });
