import express from "express";
import { 
    getLogin, 
    postLogin, 
    getRegister,
    postRegister,
    getNuevoProducto, 
    postNuevoProducto, 
    getEditarProducto, 
    postEditarProducto,
    getDashboard
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/upload.js";
import { validateID } from "../middlewares/validateId.js";

const router = express.Router();

// Ruta de Login
router.get("/login", getLogin);
router.post("/login", postLogin);

// Ruta de Register
router.get("/register", getRegister);
router.post("/register", postRegister);

// Ruta de Dashboard
router.get("/dashboard", getDashboard);

// Rutas de ABM Productos
router.get("/productos/nuevo", getNuevoProducto);
router.post("/productos/nuevo", upload.single("imagen"), postNuevoProducto);

router.get("/productos/editar/:id", validateID, getEditarProducto);
router.post("/productos/editar/:id", validateID, upload.single("imagen"), postEditarProducto);

export default router;
