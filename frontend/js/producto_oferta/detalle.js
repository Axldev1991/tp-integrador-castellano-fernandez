//Verificamos el ID que viene de la URL tanto para verificarlo tanto de un link estatico, o desde una query param
document.addEventListener("DOMContentLoaded", async function() {
    // 1. Intentamos obtener el ID del parámetro ?id= en la URL
    let id = new URLSearchParams(window.location.search).get("id");

    // 2. Si no viene en el ?, lo buscamos al final del path (ej: /productos/5)
    if (!id) {
        const pathParts = window.location.pathname.split("/");
        id = pathParts[pathParts.length - 1];
    }

    // 3. Si no hay ID o no es un número válido, mostramos error y volvemos
    if (!id || isNaN(id)) {
        const contenedor = document.getElementById("detalle-container");
        if (contenedor) {
            contenedor.innerHTML = `
            <div class="detalle-loading">
                <p>ID de producto inválido.</p>
            </div>`;
        }
        return;
    }

    console.log("ID del producto a buscar:", id);

        try {
            const response = await fetch(`http://localhost:3000/api/producto/${id}`);
            
            if (!response.ok) {
                throw new Error("Producto no encontrado");
            }

            const data = await response.json();
            const producto = data.payload;

            const contenedor = document.getElementById("detalle-container");
            if (contenedor) {
                contenedor.innerHTML = `
                    <div class="detalle-imagen-container">
                        <img src="${producto.image}" alt="${producto.name}">
                    </div>
                    <div class="detalle-info-container">
                        <div>
                            <span class="detalle-categoria">${producto.category}</span>
                            <h1 class="detalle-titulo">${producto.name.toUpperCase()}</h1>
                            <p class="detalle-id">Código de Producto: #${producto.id}</p>
                            <p class="detalle-descripcion">${producto.description || 'Sin descripción disponible.'}</p>
                        </div>
                        <div class="detalle-precio-seccion">
                            <span class="detalle-precio">$${producto.price}</span>
                            <button class="btn-agregar-detalle" id="btn-agregar-carrito">Agregar al Carrito</button>
                        </div>
                    </div>
                `;

                const btnAgregar = document.getElementById("btn-agregar-carrito");
                
                if (btnAgregar) {
                    btnAgregar.addEventListener("click", function() {
                        agregarAlCarrito(producto);
                    });
                }

            }

    } catch (error) {
        console.error("Error al cargar el detalle:", error);
        const contenedor = document.getElementById("detalle-container");
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="detalle-loading">
                    <p>El producto solicitado no existe o no está disponible.</p>
                </div>`;
        }
    }

});
