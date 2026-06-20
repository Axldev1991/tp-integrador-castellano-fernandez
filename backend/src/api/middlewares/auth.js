// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }
    // Si no está autenticado, redirigir al login
    res.redirect("/admin/login");
};

// Middleware para verificar si el usuario es admin (opcional)
export const isAdmin = (req, res, next) => {
    if (req.session && req.session.usuario) {
        // Si tenés un campo 'rol' en la sesión, podés verificarlo
        // Por ahora, solo verificamos que exista la sesión
        return next();
    }
    res.redirect("/admin/login");
};