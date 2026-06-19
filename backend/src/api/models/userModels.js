import connection from "../database/db.js";

const getUsuarioEmail = async (correo) => {
    const sql ="SELECT * FROM usuarios WHERE correo = ?";

    const [rows] = await connection.query(sql, [correo]);

    return rows[0];
}

export default{
    getUsuarioEmail
}