const queries = require('./queries');
const url = require('url');
const http = require('http');

// Tabla de usuarios (temporal para autenticación)
const users = [
    { username: 'Jiajun', password: '1111' },
    { username: 'Huankang', password: '2222' },
    { username: 'Sebastian', password: '3333' },
    { username: 'Pau', password: '4444' }
];

const server = http.createServer((request, response) => {
    const reqMethod = request.method;
    const parsedURL = url.parse(request.url, true);
    const table = parsedURL.pathname.slice(1); // Ruta solicitada
    const queryParams = parsedURL.query; // Parámetros de consulta

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log(`Método: ${reqMethod}, Ruta: ${table}`);

    if (reqMethod === 'GET') {
        handleGetRequest(table, queryParams, request, response);
    } else {
        response.writeHead(405, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ error: `Método ${reqMethod} no soportado.` }));
        response.end();
    }
});

function handleGetRequest(table, queryParams, request, response) {
    console.log('Ruta detectada:', table);
    console.log('Parámetros recibidos:', queryParams);

    // Extraer parámetros
    let student_id = queryParams.student_id;
    const username = queryParams.username;
    const password = queryParams.password;

    // Validar student_id o username/password
    if (!student_id) {
        if (!username || !password) {
            console.log('Faltan credenciales');
            response.writeHead(400, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ error: 'Usuario y contraseña o student_id son obligatorios.' }));
            response.end();
            return;
        }

        // Verificar username y password en la lista de usuarios
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            console.log('Credenciales inválidas');
            response.writeHead(401, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ error: 'Credenciales inválidas.' }));
            response.end();
            return;
        }

        // Usar la contraseña como student_id
        student_id = password;
    }

    // Manejo de rutas
    if (table === 'students') {
        const sql = `SELECT name FROM students WHERE student_id = ?`;
        console.log('Consulta generada:', sql, 'Parámetros:', [student_id]);
        queries.writeResponse(sql, [student_id], response, 'students');

    } else if (['tasks', 'marks', 'timetables'].includes(table)) {
        const queryData = queries.searchQuery(request, response);

        if (!queryData || typeof queryData.sql !== 'string' || !Array.isArray(queryData.params)) {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ error: 'Error interno al procesar la consulta.' }));
            response.end();
            return;
        }

        const sql = `SELECT * FROM ${table} WHERE student_id = ? ${queryData.sql}`;
        const params = [student_id, ...queryData.params];

        console.log('Consulta generada:', sql);
        console.log('Parámetros:', params);

        queries.writeResponse(sql, params, response, table);

    } else {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ error: 'Ruta no válida.' }));
        response.end();
    }
}


const port = 9000; // Puerto
const host = '0.0.0.0'; // Escuchar en todas las interfaces

server.listen(port, host, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
