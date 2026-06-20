import connection from "./db.js";
import bcrypt from "bcrypt";

async function seed(){
    try {
        console.log("🚀 Iniciando semillado de base de datos...");
        
        const nombre = "Admin Principal";
        const correo = "admin@autoservicio.com";
        const contrasena = "castellanosaulo";
        const rol = "admin";

        // 1. Verificar si el usuario ya existe
        const [existentes] = await connection.query(
            "SELECT id FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (existentes.length > 0) {
            console.log(`⚠️ El usuario con correo "${correo}" ya existe.`);
            console.log(`   ID: ${existentes[0].id}`);
            console.log("   Saltando creación...");
            
            // Opcional: actualizar la contraseña si cambió
            const passwordHash = await bcrypt.hash(contrasena, 10);
            await connection.query(
                "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
                [passwordHash, correo]
            );
            console.log("🔄 Contraseña actualizada.");
            
        } else {
            // 2. Crear el usuario
            const passwordHash = await bcrypt.hash(contrasena, 10);
            const [result] = await connection.query(
                "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)",
                [nombre, correo, passwordHash, rol]
            );
            
            console.log("✅ Usuario admin creado con éxito:");
            console.log(`   - ID: ${result.insertId}`);
            console.log(`   - Nombre: ${nombre}`);
            console.log(`   - Correo: ${correo}`);
            console.log(`   - Rol: ${rol}`);
        }
        
    } catch (error) {
        console.error("❌ Hubo un error al hacer el seed:", error);
    } finally {
        await connection.end();
        console.log("🔌 Conexión cerrada.");
    }
}

seed();