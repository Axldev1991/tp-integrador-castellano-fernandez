import connection from "../database/db.js";

const getUsuarioEmail = async (correo) => {
    const sql ="SELECT * FROM usuarios WHERE correo = ?";

    const [rows] = await connection.query(sql, [correo]);

    return rows[0];
}

const createUsuario = async ({ nombre, correo, contrasena, rol = 'admin' }) => {
    const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)";
    const [result] = await connection.query(sql, [nombre, correo, contrasena, rol]);
    return { id: result.insertId, nombre, correo, rol };
};

export default{
    getUsuarioEmail,
    createUsuario
}