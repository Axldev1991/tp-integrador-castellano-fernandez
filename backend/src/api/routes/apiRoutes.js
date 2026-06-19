import express from "express";
import { upload } from "../middlewares/upload.js";

import {
    getProductos,
    postVenta,
    postEncuesta,
    getProdDescripcion
} from "../controllers/apiController.js";
import { validateID } from "../middlewares/validateId.js";

const router = express.Router();

//Ruta de productos
router.get("/productos", getProductos);

//Ruta del ticket
router.post("/ventas", postVenta);

//Ruta de la encuesta
router.post("/encuestas", upload.single("archivo"), postEncuesta);

//Ruta del producto + descripcion
router.get("/producto/:id", validateID, getProdDescripcion)

export default router;