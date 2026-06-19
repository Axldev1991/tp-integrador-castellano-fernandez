import connection from "../database/db.js";

//modelo para guardar la encuesta en nuestra DB
const postEncuesta = async ({email, opinion, recomienda, nota, archivoUrl}) => {

    const sql = "INSERT INTO encuestas (cliente_email, opinion, recomienda, puntuacion, archivoUrl) VALUES (?, ?, ?, ?, ?)";

    const [rows] = await connection.query(sql, [email, opinion, recomienda, nota, archivoUrl])

    return rows;

};

export default{
    postEncuesta
}