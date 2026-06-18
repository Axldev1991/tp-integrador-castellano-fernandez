document.addEventListener("DOMContentLoaded", function () {
    const nombre = localStorage.getItem("nombreUsuario");
    const bienvenida = document.getElementById("bienvenida");
    if (nombre && bienvenida) {
        bienvenida.textContent = `HOLA ${nombre.toUpperCase()}`;
    }

    // Actualizar visualmente el valor del slider
    const slider = document.getElementById("puntuacion");
    const valorSpan = document.getElementById("valor-puntuacion");
    if (slider && valorSpan) {
        slider.addEventListener("input", function () {
            valorSpan.textContent = this.value;
        });
    }

    // Función para limpiar la sesión del usuario al salir
    function finalizarFlujo() {
        localStorage.removeItem("nombreUsuario");
        localStorage.removeItem("carrito");
        localStorage.removeItem("ultimoTicket");
        window.location.href = "../index.html";
    }

    // Omitir Encuesta
    const btnOmitir = document.getElementById("btn-omitir");
    if (btnOmitir) {
        btnOmitir.addEventListener("click", function () {
            finalizarFlujo();
        });
    }

    // Envío del Formulario
    const form = document.getElementById("formEncuesta");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Validaciones adicionales del lado del cliente
            const email = document.getElementById("email").value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                window.mostrarAlerta("Error de validación", "Por favor, ingresá un correo electrónico válido.");
                return;
            }

            // Usamos FormData porque vamos a enviar un archivo binario
            const formData = new FormData(this);

            try {
                const response = await fetch("http://localhost:3000/api/encuestas", {
                    method: "POST",
                    body: formData // Fetch setea automáticamente el Content-Type para multipart/form-data
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al enviar la encuesta.");
                }

                // Mostrar modal de agradecimiento global y redirigir al finalizar
                window.mostrarExito(
                    "¡Muchas Gracias! 🎉",
                    "Tu opinión es sumamente valiosa para nosotros y nos ayuda a seguir mejorando día a día.",
                    finalizarFlujo
                );

            } catch (error) {
                console.error(error);
                window.mostrarAlerta("Error", error.message || "No se pudo enviar la encuesta. Intentá de nuevo.");
            }
        });
    }
});
