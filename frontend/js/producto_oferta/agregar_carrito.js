let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(prod => prod.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    guardarCarrito();
    window.mostrarAlerta("Producto agregado", `${producto.name} se agregó al carrito 🛒`);
    
    notificarCambioCarrito();
    
}