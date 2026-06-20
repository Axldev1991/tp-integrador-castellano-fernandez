import express from "express";
import { upload } from "../middlewares/upload.js";

import { postVenta, getVentas, getVentaById } from "../controllers/ventas.controllers.js";
import { validateVenta } from "../middlewares/validators.js";

const router = express.Router();

router.get("/", getVentas);

router.get("/:id", getVentaById);

router.post("/", validateVenta, postVenta);

export default router;