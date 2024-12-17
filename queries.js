import mysql from 'mysql2';
import { URL } from 'url';

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
function writeResponse(sql, response, table) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error al obtener la conexión: ', err);
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ error: 'Error al obtener la conexion' }));
            response.end();
            return;
        }

        connection.query(sql, function (error, results) {
            connection.release();
            if (error) {
                console.error('Error en la consulta SQL: ', error);
                response.writeHead(404, { "Content-Type": "application/json" });
                response.write(JSON.stringify({ error: 'Error al ejecutar la consulta SQL', details: error.message }));
                response.end();
                return;
            }

            if (results.length === 0) {
                console.log('No se encontraron resultados');
                response.writeHead(404, { "Content-Type": "application/json" });
                response.write(JSON.stringify({ message: 'No se encontraron resultados' }));
                response.end();
                return;
            }

            response.writeHead(200, { "Content-Type": "application/json" });
            const jsonArray = { [table]: results };
            console.log(JSON.stringify(jsonArray));
            response.write(JSON.stringify(jsonArray));
            response.end();
        });
    });
}

// Genera una consulta SQL con parámetros
function searchQuery(request, response) {
    const date = new Date(Date.now());
    const now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const url = new URL(request.url, "http://127.0.0.1:9000");
    const params = new URLSearchParams(url.search);

    let sql = '';
    const keywords2 = {
        '[gt]': '>',
        '[lt]': '<',
        '[gte]': '>=',
        '[lte]': '<=',
        'now': 'NOW()',
        'Mon': 1,
        'Tue': 2,
        'Wed': 3,
        'Thu': 4,
        'Fri': 5,
    };
    

    let diaDef;

    // Construcción dinámica de SQL
    for (let [key, value] of params.entries()) {
    if (key === 'limit') continue;

    let replaced = false;

    // Reemplazo de claves y valores
    for (let [keyword, replacement] of Object.entries(keywords2)) {
        if (key.includes(keyword)) {
            key = key.replace(keyword, replacement);
            replaced = true;
        }
        if (value === keyword) {
            value = replacement;
            replaced = true;
        }
    }

    // Construcción del SQL según el tipo de clave y valor
    if (key === 'hour') {
        // Manejo específico para horas
        sql += ` AND ${key} >= '${value}'`;
    } else if (key === 'day') {
        // Manejo específico para día (guarda el valor numérico)
        diaDef = parseInt(value, 10);
        sql += ` AND ${key} = '${value}'`;
    } else {
        // Verifica si el valor es una función SQL como NOW()
        const formattedValue = value === 'NOW()' ? value : `${value}`;
        sql += ` AND ${key} ${replaced ? '' : '='} ${formattedValue}`;
        
    }
}
    // Ordenación específica para tasks
    if (url.pathname === '/tasks') {
        sql += ` ORDER BY ABS(DATEDIFF(CURRENT_DATE, date)) ASC`;
    }
    // Ordenación específica para timetables
    else if (url.pathname === '/timetables') {
        if(!params.has('day')) diaDef = date.getDay();
        sql += ` ORDER BY FIELD(day`;
        for (let i = 0; i < 6; i++) {
            sql += `, '${(diaDef + i) % 6}'`;
        }
        sql += ')';
    }

    if (params.has('limit')) {
        sql += ` LIMIT ${parseInt(params.get('limit'), 10)}`;
    }

    console.log('Generated SQL:', sql);
    return sql + ';';
}

export { searchQuery, writeResponse, logoutFunction };
