let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregar(producto){
    const productoExistente = carrito.find(prod => prod.id === producto.id);

    if(productoExistente){
        productoExistente.cantidad++;
    }else{
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenURL: producto.imagenURL,
            cantidad: 1
        });
    }
    guardarCarrito();    
}

function eliminar(productoId){
    carrito = carrito.filter(prod => prod.id !== productoId);
    guardarCarrito();
}

function cambiarCantidad(productoId, nuevaCantidad){
    let producto = carrito.find(prod => prod.id === productoId);

    if(nuevaCantidad === 0){
        eliminar(productoId);
    }else if(producto){
        producto.cantidad = nuevaCantidad;
    }
    guardarCarrito();
}

/* --- LÓGICA DE MODAL DE CONFIRMACIÓN --- */
function cerrarModalConfirmacion() {
    const modal = document.getElementById("modalConfirmacion");
    if (modal) {
        modal.style.display = "none";
    }
}

function confirmarCompra() {
    // Verificación básica: ¿el carrito tiene productos?
    if (carrito.length === 0) {
        mostrarAlerta("El carrito está vacío.");
        return;
    }

    const nombreCliente = localStorage.getItem("nombreUsuario");
    if (!nombreCliente) {
        mostrarAlerta("Error: Nombre de cliente no encontrado.", () => {
            window.location.href = "../index.html"; // Redirige tras aceptar el modal
        });
        return;
    }

    // Mostramos el modal de confirmación personalizado
    const modal = document.getElementById("modalConfirmacion");
    if (modal) {
        modal.style.display = "flex";
    }
}

async function enviarVentaAlServidor() {
    cerrarModalConfirmacion();

    const nombreCliente = localStorage.getItem("nombreUsuario");
    const precioTotal = carrito.reduce((acumulado, prod) => acumulado + (prod.precio * prod.cantidad), 0);

    const datosVenta = {
        nombreCliente: nombreCliente,
        precioTotal: precioTotal,
        productos: carrito.map(prod => ({
            id: prod.id,
            cantidad: prod.cantidad,
            precio: prod.precio
        }))
    };

    try {
        const response = await fetch("http://localhost:3000/api/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosVenta)
        });

        if (response.ok) {
            // Guardamos los datos de la venta efectuada para mostrarlos en el ticket
            localStorage.setItem("ultimoTicket", JSON.stringify({
                cliente: nombreCliente,
                productos: carrito,
                total: precioTotal,
                fecha: new Date().toLocaleString()
            }));

            // Limpiamos el carrito y redirigimos
            carrito = [];
            guardarCarrito();
            
            window.location.href = "ticket.html"; // Pantalla de ticket
        } else {
            const errorData = await response.json();
            mostrarAlerta("Hubo un error al procesar la venta: " + (errorData.message || "Error desconocido"));
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        mostrarAlerta("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
    }
}

/* --- LÓGICA DE ALERTA / ERROR PERSONALIZADA --- */
function mostrarAlerta(mensaje, callback = null) {
    const modal = document.getElementById("modalAlerta");
    const msgParafo = document.getElementById("alertaMensaje");
    if (modal && msgParafo) {
        msgParafo.textContent = mensaje;
        modal.style.display = "flex";
        // Almacenamos temporalmente el callback en una propiedad global
        window.alertaCallback = callback;
    }
}

function cerrarAlerta() {
    const modal = document.getElementById("modalAlerta");
    if (modal) {
        modal.style.display = "none";
        // Si hay un callback registrado al cerrar el modal, lo ejecutamos
        if (window.alertaCallback) {
            window.alertaCallback();
            window.alertaCallback = null;
        }
    }
}

// Inicialización de los eventos del modal una vez cargado el DOM
document.addEventListener("DOMContentLoaded", () => {
    const btnSi = document.getElementById("btnConfirmarSi");
    const btnNo = document.getElementById("btnConfirmarNo");
    const btnAlertaAceptar = document.getElementById("btnAlertaAceptar");

    if (btnSi) {
        btnSi.addEventListener("click", enviarVentaAlServidor);
    }
    if (btnNo) {
        btnNo.addEventListener("click", cerrarModalConfirmacion);
    }
    if (btnAlertaAceptar) {
        btnAlertaAceptar.addEventListener("click", cerrarAlerta);
    }
});
