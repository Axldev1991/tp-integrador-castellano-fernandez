// routes/admin.routes.js
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
    getDashboard,
    getHistorialVentas,
    toggleProducto
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/upload.js";
import { validateLogin, validateRegister, validateProduct, validateID } from "../middlewares/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { exportarVentasExcel } from "../controllers/ventas.controllers.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get("/login", getLogin);
router.post("/login", validateLogin, postLogin);
router.get("/register", getRegister);
router.post("/register", validateRegister, postRegister);

// Rutas protegidas (requieren autenticación)
router.get("/dashboard", isAuthenticated, getDashboard);
router.get("/ventas", isAuthenticated, getHistorialVentas);
router.get("/productos/nuevo", isAuthenticated, getNuevoProducto);
router.post("/productos/nuevo", isAuthenticated, upload.single("imagen"), validateProduct, postNuevoProducto);
router.get("/productos/editar/:id", isAuthenticated, validateID, getEditarProducto);
router.post("/productos/editar/:id", isAuthenticated, validateID, upload.single("imagen"), validateProduct, postEditarProducto);
router.post("/productos/toggle/:id", isAuthenticated, validateID, toggleProducto);

router.get("/ventas/exportar", isAuthenticated, exportarVentasExcel); 

export default router;