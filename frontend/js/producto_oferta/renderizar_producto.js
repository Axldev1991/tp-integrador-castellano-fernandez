// js/renderizar.js
function renderizarProductos(array, type) {
    const contenedorProductos = document.getElementById("contenedor-productos");
    if (!contenedorProductos) return;

    let htmlProductos = "";

    // Filtrar por tipo si es necesario
    const productosFiltrados = type ? array.filter(p => p.type === type) : array;

    productosFiltrados.forEach(producto => {
        htmlProductos += `
            <div class="card-producto" data-id="${producto.id}" data-name="${producto.name}" data-image="${producto.image}" data-price="${producto.price}">
                <div class="card-producto-imagen" style="position: relative; width: 100%; height: 160px; overflow: hidden;">
                    <img src="${producto.image}" alt="${producto.name}">
                    <div class="card-overlay">
                        <button class="btn-card-detalle" data-id="${producto.id}">Ver detalle</button>
                    </div>
                </div>
                <div class="card-producto-info">
                    <div>
                        <h3>${producto.name.toUpperCase()}</h3>
                        <p>ID: ${producto.id}</p>
                    </div>
                    <p>$${producto.price}</p>
                </div>
            </div>
        `;
    });

    contenedorProductos.innerHTML = htmlProductos;

    // 1. Agregar evento a las cards para meter al carrito
    document.querySelectorAll(".card-producto").forEach(card => {
        card.addEventListener("click", function() {
            const producto = {
                id: parseInt(this.getAttribute("data-id")),
                name: this.getAttribute("data-name"),
                image: this.getAttribute("data-image"),
                price: parseInt(this.getAttribute("data-price"))
            };
            if (typeof agregarAlCarrito !== 'undefined') {
                agregarAlCarrito(producto);
            }
        });
    });

    // 2. Agregar evento exclusivo a los botones "Ver Detalle" para redireccionar
    document.querySelectorAll(".btn-card-detalle").forEach(boton => {
        boton.addEventListener("click", function(event) {
            // Detenemos la propagación para que el clic no llegue a la tarjeta (.card-producto)
            event.stopPropagation();

            // Obtenemos el ID del producto que guardamos en el atributo HTML
            const id = this.getAttribute("data-id");

            // Redireccionamos a la pantalla de detalles
            window.location.href = `/productos/${id}`;
        });
    });
}