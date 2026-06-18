function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    // if (typeof renderizarCarrito === 'function') renderizarCarrito();
    renderizarCarrito()
}

function finalizarCompra() {
    if (carrito.length === 0) {
        window.mostrarAlerta("Carrito vacío", "No hay productos en tu carrito para finalizar la compra.");
        return;
    }
    window.mostrarConfirmacion(
        "Confirmar Compra",
        "¿Estás seguro de que deseas finalizar tu compra?",
        confirmarCompra
    );
}

async function confirmarCompra() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const fechaActual = new Date().toLocaleString();
    
    const venta = {
        cliente: nombreUsuario,
        fecha: fechaActual,
        items: carrito.map(item => ({
            id: item.id,
            nombre: item.name,
            cantidad: item.cantidad,
            precio_unitario: item.price,
            subtotal: item.price * item.cantidad
        })),
        total: carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0)
    };
    
    try {
        // Enviar a la API
        const response = await fetch("http://localhost:3000/api/ventas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(venta)
        });

        if (!response.ok) throw new Error("Error al guardar la venta");

        localStorage.setItem("ultimoTicket", JSON.stringify(venta));
        vaciarCarrito();
        window.location.href = "./ticket.html";

        
    } catch (error) {
        console.error(error);
        window.mostrarAlerta("Error", "No se pudo completar la compra. Intentá de nuevo.");
    }
}