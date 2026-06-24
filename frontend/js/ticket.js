async function generarTicketPDF(venta) {
    if (typeof window.jspdf === 'undefined') {
        await cargarLibreriaPDF();
    }

    // Montamos la librería y desestructuramos en objetos para traernos solo la clase constructor
    const { jsPDF } = window.jspdf;

    // Creamos el documento PDF (por defecto es vertical, A4 y en milímetros)
    const doc = new jsPDF();

    let x = 20; // Margen izquierdo
    let y = 25; // Margen superior inicial

    // Configuración de encabezado
    doc.setFont("courier", "bold");
    doc.setFontSize(22);
    doc.text("No hay Polque Store", x, y);
    
    y += 10;
    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    doc.text("Ticket de Compra", x, y);
    
    y += 8;
    doc.text(`Fecha: ${venta.fecha}`, x, y);
    
    y += 6;
    doc.text(`Cliente: ${venta.cliente}`, x, y);
    
    y += 10;
    doc.text("------------------------------------------------------------", x, y);
    
    // Encabezados de la Tabla
    y += 8;
    doc.setFont("courier", "bold");
    doc.text("Producto", x, y);
    doc.text("Cant", x + 80, y);
    doc.text("Precio", x + 105, y);
    doc.text("Subtotal", x + 135, y);
    
    y += 6;
    doc.setFont("courier", "normal");
    doc.text("------------------------------------------------------------", x, y);
    
    y += 8;
    // La función generarTicketPDF nos trajo parseado a JSON el objeto venta con todos los productos.
    // Recorremos los productos del ticket
    venta.items.forEach(item => {
        // Si el nombre es muy largo, lo recortamos para que no se pise con la cantidad
        let nombre = item.nombre;
        if (nombre.length > 22) {
            nombre = nombre.substring(0, 19) + "...";
        }
        
        doc.text(nombre, x, y);
        doc.text(String(item.cantidad), x + 80, y);
        doc.text(`$${item.precio_unitario}`, x + 105, y);
        doc.text(`$${item.subtotal}`, x + 135, y);
        
        y += 8; // Incrementamos y para cada fila de producto
    });

    doc.text("------------------------------------------------------------", x, y);
    
    // Total de la venta
    y += 10;
    doc.setFont("courier", "bold");
    doc.setFontSize(13);
    doc.text(`TOTAL: $${venta.total}`, x + 115, y);
    
    // Footer centrado en la página A4 (210 mm / 2 = 105 mm)
    y += 20;
    doc.setFont("courier", "italic");
    doc.setFontSize(10);
    doc.text("Gracias por tu compra", 105, y, { align: "center" });
    
    y += 6;
    doc.text('"Y recordá, si te cae mal, No hay polque!"', 105, y, { align: "center" });

    // Guardamos el PDF con el nombre del cliente y timestamp
    const nombreTicket = `ticket_${venta.cliente}_${Date.now()}.pdf`;
    doc.save(nombreTicket);
}


function cargarLibreriaPDF() {
    return new Promise((resolve, reject) => {
        // Chequeamos si el script de jspdf ya está en el DOM, para evitar descargar la librería varias veces si el usuario ya había generado un ticket anteriormente
        if (document.querySelector('script[src*="jspdf"]')) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
