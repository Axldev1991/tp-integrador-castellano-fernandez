async function generarTicketPDF(venta) {

    if (typeof html2pdf === 'undefined') {
        await cargarLibreriaPDF();
    }
    
    
    const ticketHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Ticket de Compra</title>
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    max-width: 400px;
                    margin: 0 auto;
                    color: black;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #333;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 5px 0;
                    font-size: 12px;
                }
                .productos {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .productos th, .productos td {
                    border-bottom: 1px dotted #ccc;
                    padding: 8px 0;
                    text-align: left;
                }
                .productos th {
                    border-bottom: 1px solid #333;
                }
                .total {
                    text-align: right;
                    border-top: 2px solid #333;
                    padding-top: 10px;
                    margin-top: 10px;
                    padding-right: 50px;
                    font-size: 18px;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 10px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>No hay Polque Store</h1>
                <p>Ticket de Compra</p>
                <p>Fecha: ${venta.fecha}</p>
                <p>Cliente: ${venta.cliente}</p>
            </div>
            
            <table class="productos">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cant</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${venta.items.map(item => `
                        <tr>
                            <td>${item.nombre}</td>
                            <td>${item.cantidad}</td>
                            <td>$${item.precio_unitario}</td>
                            <td>$${item.subtotal}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total">
                TOTAL: $${venta.total}
            </div>
            
            <div class="footer">
                <p>Gracias por tu compra</p>
                <p>"Y recordá, si te cae mal, No hay polque!"</p>
            </div>
        </body>
        </html>
    `;
    
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `ticket_${venta.cliente}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(ticketHTML).save();
}

function cargarLibreriaPDF() {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="html2pdf"]')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}


