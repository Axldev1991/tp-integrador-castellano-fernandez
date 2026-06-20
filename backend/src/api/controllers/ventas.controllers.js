import ventaModels from "../models/venta.models.js";
import xlsx from "xlsx";

//funcion de nuestra API-Cliente en donde vamos a registrar una venta exitosa
export const postVenta = async (req, res) => {
    const { cliente, total, items } = req.body;

    try {
        await ventaModels.registrarVenta({ cliente, total, items });

        return res.status(201).json({
            status: "success",
            message: "¡Venta registrada con éxito!"
        });

    } catch (error) {
        console.error("Error al registrar venta:", error);
        res.status(500).json({ error: error.message });
    }
}

// GET: Obtener todas las ventas
export const getVentas = async (req, res) => {
    try {
        const ventas = await ventaModels.obtenerVentas();

        return res.status(200).json({
            status: "success",
            total: ventas.length,
            ventas
        });

    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener una venta específica por ID
export const getVentaById = async (req, res) => {
    const { id } = req.params;

    try {
        const venta = await ventaModels.obtenerVentaById(id);

        if (!venta) {
            return res.status(404).json({
                status: "error",
                message: "Venta no encontrada"
            });
        }

        return res.status(200).json({
            status: "success",
            venta
        });

    } catch (error) {
        console.error("Error al obtener venta:", error);
        res.status(500).json({ error: error.message });
    }
};


export const exportarVentasExcel = async (req, res) => {
    try {
        const ventas = await ventaModels.obtenerVentas();

        if (!ventas || ventas.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No hay ventas para exportar"
            });
        }

        // Preparar datos para el Excel
        const datosExcel = [];

        ventas.forEach(venta => {
            if (venta.productos && venta.productos.length > 0) {
                venta.productos.forEach(prod => {
                    datosExcel.push({
                        'ID Venta': venta.id,
                        'Fecha': new Date(venta.fecha).toLocaleString('es-AR'),
                        'Cliente': venta.nombreCliente,
                        'Producto': prod.productoNombre,
                        'Cantidad': prod.cantidad,
                        'Precio Unitario': prod.precioUnitario,
                        'Subtotal': prod.cantidad * prod.precioUnitario,
                        'Total Venta': venta.precioTotal
                    });
                });
            } else {
                // Si no tiene productos (caso borde)
                datosExcel.push({
                    'ID Venta': venta.id,
                    'Fecha': new Date(venta.fecha).toLocaleString('es-AR'),
                    'Cliente': venta.nombreCliente,
                    'Producto': 'Sin productos',
                    'Cantidad': 0,
                    'Precio Unitario': 0,
                    'Subtotal': 0,
                    'Total Venta': venta.precioTotal
                });
            }
        });

        // Crear un libro de Excel
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(datosExcel);

        // Ajustar ancho de columnas
        const colWidths = [
            { wch: 12 }, // ID Venta
            { wch: 20 }, // Fecha
            { wch: 25 }, // Cliente
            { wch: 30 }, // Producto
            { wch: 12 }, // Cantidad
            { wch: 18 }, // Precio Unitario
            { wch: 15 }, // Subtotal
            { wch: 15 }  // Total Venta
        ];
        ws['!cols'] = colWidths;

        xlsx.utils.book_append_sheet(wb, ws, 'Ventas');

        // Generar el archivo
        const filename = `ventas_${new Date().toISOString().slice(0, 10)}.xlsx`;
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (error) {
        console.error("Error al exportar ventas a Excel:", error);
        res.status(500).json({
            status: "error",
            message: "Error al exportar ventas"
        });
    }
};