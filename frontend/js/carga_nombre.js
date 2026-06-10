const inputNombre = document.getElementById("nombreUsuario");

document.getElementById("formNombre")
    .addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();

        if (!nombre) {
            alert("Ingresá tu nombre");
            return;
        }

        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "./pages/productos.html";
    });