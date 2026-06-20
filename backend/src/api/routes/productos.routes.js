import express from "express";
import { upload } from "../middlewares/upload.js";

import { getProductos, getProdDescripcion } from "../controllers/productos.controllers.js";
import { validateID } from "../middlewares/validators.js";

const router = express.Router();

//Ruta de productos
router.get("/", getProductos);

//Ruta del producto + descripcion
router.get("/:id", validateID, getProdDescripcion)

export default router;