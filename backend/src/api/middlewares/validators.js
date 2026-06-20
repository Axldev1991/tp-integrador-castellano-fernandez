export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const validatePositivePrice = (price) => {
    const priceNum = parseFloat(price);
    return !isNaN(priceNum) && priceNum > 0;
};


export const validateRegister = (req, res, next) => {
    const { nombre, correo, contrasena, confirmar_contrasena } = req.body;
    const errors = [];

    // Validar nombre
    if (!nombre || nombre.trim().length < 3) {
        errors.push("El nombre debe tener al menos 3 caracteres");
    }

    // Validar email
    if (!correo || !validateEmail(correo)) {
        errors.push("El email no es válido");
    }

    // Validar contraseña
    if (!contrasena || contrasena.length < 6) {
        errors.push("La contraseña debe tener al menos 6 caracteres");
    }

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmar_contrasena) {
        errors.push("Las contraseñas no coinciden");
    }

    if (errors.length > 0) {
        return res.status(400).render("register", {
            error: errors.join(" • "),
            nombre,
            correo
        });
    }

    next();
};


export const validateProduct = (req, res, next) => {
    const { nombre, descripcion, precio, categoria } = req.body;
    const errors = [];

    // Validar nombre
    if (!nombre || nombre.trim().length < 2) {
        errors.push("El nombre del producto es obligatorio (mínimo 2 caracteres)");
    }

    // Validar descripción
    if (!descripcion || descripcion.trim().length < 5) {
        errors.push("La descripción es obligatoria (mínimo 5 caracteres)");
    }

    // Validar precio (positivo)
    if (!validatePositivePrice(precio)) {
        errors.push("El precio debe ser un número positivo mayor a 0");
    }

    // Validar categoría
    const categoriasValidas = ['Pantalones', 'Remeras'];
    if (!categoria || !categoriasValidas.includes(categoria)) {
        errors.push(`Categoría inválida. Debe ser: ${categoriasValidas.join(', ')}`);
    }

    if (errors.length > 0) {
        // Si hay errores, volvemos al formulario con los datos parciales
        return res.status(400).render("formulario-producto", {
            producto: { ...req.body, id: req.params.id || null },
            error: errors.join(" • ")
        });
    }

    next();
};


export const validateLogin = (req, res, next) => {
    const { correo, contrasena } = req.body;
    const errors = [];

    if (!correo || !validateEmail(correo)) {
        errors.push("El email no es válido");
    }

    if (!contrasena || contrasena.length < 1) {
        errors.push("La contraseña es obligatoria");
    }

    if (errors.length > 0) {
        return res.status(400).render("login", {
            error: errors.join(" • ")
        });
    }

    next();
};


export function validateID (req, res, next){
    const idNum = Number(req.params.id);

    if(!Number.isInteger(idNum) || idNum <= 0){
        return  res.status(400).json({error: "El id debe ser un número entero positivo"});
    }

    req.id = idNum;

    next();
};


export const validateVenta = (req, res, next) => {
    const { cliente, total, items } = req.body;
    const errors = [];

    // Validar cliente
    if (!cliente || cliente.trim().length < 2) {
        errors.push("El nombre del cliente es obligatorio");
    }

    // Validar total
    if (!validatePositivePrice(total)) {
        errors.push("El total debe ser un número positivo");
    }

    // Validar items (array de productos)
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push("La venta debe incluir al menos un producto");
    } else {
        // Validar cada item
        items.forEach((item, index) => {
            if (!item.id || !validatePositivePrice(item.id)) {
                errors.push(`Item ${index + 1}: ID de producto inválido`);
            }
            if (!item.cantidad || !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
                errors.push(`Item ${index + 1}: cantidad debe ser un número entero positivo`);
            }
            if (!validatePositivePrice(item.precio_unitario)) {
                errors.push(`Item ${index + 1}: precio unitario debe ser positivo`);
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: "error",
            errors: errors
        });
    }

    next();
};
