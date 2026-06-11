document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    
    if (nombreGuardado) {
        window.location.href = "./pages/productos.html";
    }
});