const mysql = require('mysql2');
const url = require('url');

// Crear pool de conexiones
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'yezang',
    password: '1234',
    database: 'cdr',
    port: 3306,
});

// Convierte un objeto a un arreglo de parámetros
function objectToArray(obj) {
    return Object.keys(obj).map(key => ({ parameter: key, value: obj[key] }));
}

// Función para logout
function logoutFunction(response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("¡Logout exitoso!");
    response.end();
}

// Función para escribir la respuesta a consultas SQL
function writeResponse(sql, params, response, table) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            if (!response.headersSent) {
                response.writeHead(500, { "Content-Type": "application/json" });
                response.write(JSON.stringify({ error: 'Error al obtener la conexión', details: err.message }));
                response.end();
            }
            return;
        }

        connection.execute(sql, params, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error en la consulta SQL:', error);
                if (!response.headersSent) {
                    response.writeHead(500, { "Content-Type": "application/json" });
                    response.write(JSON.stringify({ error: 'Error al ejecutar la consulta SQL', details: error.message }));
                    response.end();
                }
                return;
            }

            // Generar respuesta en formato JSON
            const jsonResponse = { [table]: results };
            console.log("Enviando respuesta al cliente:", JSON.stringify(jsonResponse));

            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(jsonResponse));
            response.end();
        });
    });
}


// Genera una consulta SQL con parámetros
function searchQuery(request, response) {
    const reqURL = request.url;
    const q = url.parse(reqURL, true);

    if (q.pathname === '/favicon.ico') {
        response.writeHead(204); // Sin contenido
        response.end();
        return null;
    }

    const validTables = ['tasks', 'marks', 'timetables'];
    const tableName = q.pathname.slice(1);

    if (!validTables.includes(tableName)) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ error: "Ruta no válida" }));
        response.end();
        return null;
    }

    let sql = '';
    const params = [];

    const query = objectToArray(q.query);
    query.forEach(({ parameter, value }) => {
        if (parameter !== 'student_id' && value) {
            sql += ` AND ${parameter} = ?`;
            params.push(value);
        }
    });

    console.log('searchQuery: condiciones generadas:', sql);
    console.log('searchQuery: parámetros:', params);

    return { sql, params };
}




module.exports = { searchQuery, writeResponse, logoutFunction };
