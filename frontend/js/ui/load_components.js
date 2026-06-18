async function cargarComponentesComunes() {
    const headerElement = document.querySelector("header:not(.header-logo)");
    const footerElement = document.querySelector("footer");

    // Detectamos si estamos en una subcarpeta (pages/) o en la raíz
    const path = window.location.pathname;
    const esSubcarpeta = path.includes("/pages/");
    
    // Si estamos en la raíz (index.html), los recursos están en ./
    // Si estamos en pages/, los recursos están en ../
    const basePath = esSubcarpeta ? "../" : "./";
    const pagesPath = esSubcarpeta ? "./" : "./pages/";
    
    // 1. Cargar e Inyectar el Header (si el elemento existe en el HTML actual)
    if (headerElement) {
        try {
            const response = await fetch(`${basePath}components/header.html`);
            if (!response.ok) throw new Error("No se pudo cargar el header.");
            let html = await response.text();
            
            // Reemplazar los placeholders por las rutas dinámicas correctas
            html = html.replace(/{basePath}/g, basePath);
            html = html.replace(/{pagesPath}/g, pagesPath);
            
            headerElement.innerHTML = html;
            
            // Inicializar el evento del botón Salir después de inyectarlo en el DOM
            configurarBotonSalir(basePath);
        } catch (error) {
            console.error("Error cargando el header component:", error);
        }
    }

    // 2. Cargar e Inyectar el Footer (si el elemento existe)
    if (footerElement) {
        try {
            const response = await fetch(`${basePath}components/footer.html`);
            if (!response.ok) throw new Error("No se pudo cargar el footer.");
            const html = await response.text();
            footerElement.innerHTML = html;
        } catch (error) {
            console.error("Error cargando el footer component:", error);
        }
    }

    // 3. Cargar e Inyectar Modales Globales
    try {
        const response = await fetch(`${basePath}components/modal.html`);
        if (!response.ok) throw new Error("No se pudo cargar el componente de modales.");
        const html = await response.text();
        document.body.insertAdjacentHTML("beforeend", html);
        inicializarModalesGlobales();
    } catch (error) {
        console.error("Error cargando los modales comunes:", error);
    }
}

// Variables para almacenar callbacks temporales de los modales
let callbackAlertaActual = null;
let callbackExitoActual = null;
let callbackConfirmarSiActual = null;
let callbackConfirmarNoActual = null;

function inicializarModalesGlobales() {
    const btnAlerta = document.getElementById("btnAlertaGlobalAceptar");
    const btnExito = document.getElementById("btnExitoGlobalAceptar");
    const btnConfirmarSi = document.getElementById("btnConfirmarGlobalSi");
    const btnConfirmarNo = document.getElementById("btnConfirmarGlobalNo");

    if (btnAlerta) {
        btnAlerta.addEventListener("click", () => {
            document.getElementById("modalAlertaGlobal").style.display = "none";
            if (typeof callbackAlertaActual === "function") {
                callbackAlertaActual();
                callbackAlertaActual = null;
            }
        });
    }

    if (btnExito) {
        btnExito.addEventListener("click", () => {
            document.getElementById("modalExitoGlobal").style.display = "none";
            if (typeof callbackExitoActual === "function") {
                callbackExitoActual();
                callbackExitoActual = null;
            }
        });
    }

    if (btnConfirmarSi) {
        btnConfirmarSi.addEventListener("click", () => {
            document.getElementById("modalConfirmacionGlobal").style.display = "none";
            if (typeof callbackConfirmarSiActual === "function") {
                callbackConfirmarSiActual();
                callbackConfirmarSiActual = null;
            }
        });
    }

    if (btnConfirmarNo) {
        btnConfirmarNo.addEventListener("click", () => {
            document.getElementById("modalConfirmacionGlobal").style.display = "none";
            if (typeof callbackConfirmarNoActual === "function") {
                callbackConfirmarNoActual();
                callbackConfirmarNoActual = null;
            }
        });
    }

    // Exponer funciones en el objeto window para usarlas en cualquier script
    window.mostrarAlerta = function (titulo, mensaje, callback = null) {
        const modal = document.getElementById("modalAlertaGlobal");
        const tit = document.getElementById("modalAlertaTitulo");
        const msg = document.getElementById("modalAlertaMensaje");
        if (modal && tit && msg) {
            tit.textContent = titulo;
            msg.textContent = mensaje;
            callbackAlertaActual = callback;
            modal.style.display = "flex";
        } else {
            alert(`${titulo}: ${mensaje}`);
            if (callback) callback();
        }
    };

    window.mostrarExito = function (titulo, mensaje, callback = null) {
        const modal = document.getElementById("modalExitoGlobal");
        const tit = document.getElementById("modalExitoTitulo");
        const msg = document.getElementById("modalExitoMensaje");
        if (modal && tit && msg) {
            tit.textContent = titulo;
            msg.textContent = mensaje;
            callbackExitoActual = callback;
            modal.style.display = "flex";
        } else {
            alert(`${titulo}: ${mensaje}`);
            if (callback) callback();
        }
    };

    window.mostrarConfirmacion = function (titulo, mensaje, onConfirm, onCancel = null) {
        const modal = document.getElementById("modalConfirmacionGlobal");
        const tit = document.getElementById("modalConfirmacionTitulo");
        const msg = document.getElementById("modalConfirmacionMensaje");
        if (modal && tit && msg) {
            tit.textContent = titulo;
            msg.textContent = mensaje;
            callbackConfirmarSiActual = onConfirm;
            callbackConfirmarNoActual = onCancel;
            modal.style.display = "flex";
        } else {
            if (confirm(`${titulo}\n\n${mensaje}`)) {
                if (onConfirm) onConfirm();
            } else {
                if (onCancel) onCancel();
            }
        }
    };
}

// Configura el botón Salir dinámicamente según la ubicación del archivo
function configurarBotonSalir(basePath) {
    const btnSalir = document.getElementById("boton-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", function () {
            // Limpiar todo el estado de la compra e iniciar sesión del cliente
            localStorage.removeItem("nombreUsuario");
            localStorage.removeItem("carrito");
            localStorage.removeItem("ultimoTicket");
            
            // Redirigir al index.html de la raíz
            window.location.href = `${basePath}index.html`;
        });
    }
}

// Inicializar la carga cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarComponentesComunes);
