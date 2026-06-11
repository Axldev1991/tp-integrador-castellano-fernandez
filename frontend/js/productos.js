//BOTON CERRAR SESION
const botonSalir = document.getElementById("boton-salir");

if (botonSalir) {
    botonSalir.addEventListener("click", (e) => {
        e.preventDefault();
        
        const confirmar = confirm("¿Estás seguro que querés salir?");
        
        if (confirmar) {
            localStorage.removeItem("nombreUsuario");
            window.location.href = "../index.html";
        }
    });
}


