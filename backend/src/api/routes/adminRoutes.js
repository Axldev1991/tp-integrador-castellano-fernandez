import express from "express";
import { 
    getLogin, 
    postLogin, 
    getNuevoProducto, 
    postNuevoProducto, 
    getEditarProducto, 
    postEditarProducto,
    getDashboard
} from "../controllers/adminController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Ruta de Login
router.get("/login", getLogin);
router.post("/login", postLogin);

// Ruta de Dashboard
router.get("/dashboard", getDashboard);

// Rutas de ABM Productos
router.get("/productos/nuevo", getNuevoProducto);
router.post("/productos/nuevo", upload.single("imagen"), postNuevoProducto);

router.get("/productos/editar/:id", getEditarProducto);
router.post("/productos/editar/:id", upload.single("imagen"), postEditarProducto);

export default router;
