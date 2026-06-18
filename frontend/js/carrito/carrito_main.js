document.addEventListener("DOMContentLoaded", function() {

    const nombre = localStorage.getItem("nombreUsuario");
    const bienvenida = document.getElementById("bienvenida");
    if (nombre && bienvenida) {
        bienvenida.textContent = `HOLA ${nombre.toUpperCase()}`;
    }
    
    // if (typeof renderizarCarrito === 'function') {
    //     renderizarCarrito();
    // }
    renderizarCarrito();
    
    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", finalizarCompra);
    }
    
    const btnSalir = document.getElementById("boton-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", function() {
            localStorage.removeItem("nombreUsuario");
            window.location.href = "../index.html";
        });
    }
});