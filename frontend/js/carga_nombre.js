const inputNombre = document.getElementById("nombreUsuario");

document.getElementById("formNombre")
    .addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();

        if (!nombre) {
            alert("Ingresá tu nombre");
            return;
        }

        if (/\d/.test(nombre)) {
        alert("El nombre no puede tener numeros");
            return;
        }

        if (nombre.length <= 2){
            alert("El nombre tiene que tener mas de 2 letras, no se admiten Li");
            return;
        } 

        if (nombre.length > 15){
            alert("Demaciadas letras, no me cuentes tu vida crack");
            return;
        } 

        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "./pages/productos.html";
        

    });