import { writeResponse, searchQuery, logoutFunction } from './queries.js';
import { URL } from 'url';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var studentId;

const server = http.createServer((request, response) => {
    const reqMethod = request.method;
    const reqURL = request.url;
    const q = new URL(reqURL, `http://${request.headers.host}`);
    const table = q.pathname.slice(1); // Quitar la barra inicial

    response.setHeader('Access-Control-Allow-Origin', '*');

    if (reqMethod === "GET") {
        if (isStaticFile(reqURL)) {
            // Manejar archivos estáticos (.html, .css, .js, etc.)
            serveStaticFile(reqURL, response);
            return;
        }

        if (table === '') {
            // Sirve el archivo index.html para la raíz "/"
            serveFile('index.html', response);
        } else if (table === 'menu') {
            // Sirve el archivo menu.html para "/menu"
            serveFile('menu.html', response);
        } else if (table === 'students') {
            studentId = q.searchParams.get('student_id');
            if (!studentId) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'Falta el parámetro student_id' }));
                return;
            }
            const sql = `SELECT name FROM students WHERE student_id='${studentId}';`;
            writeResponse(sql, response, table);
        } else if (table === 'logout') {
            logoutFunction(response);
        } else {
          var sql = `SELECT * FROM ${table} WHERE student_id = '${studentId}'` + searchQuery(request, response);
          console.log(sql);
          writeResponse(sql, response, table);
        }
    } else {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Método no permitido' }));
    }
});

// Función para verificar si es un archivo estático
function isStaticFile(url) {
    const staticFileExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico'];
    return staticFileExtensions.some((ext) => url.endsWith(ext));
}

// Función para servir archivos estáticos
function serveStaticFile(reqURL, response) {
    const filePath = path.join(__dirname, reqURL);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('Archivo no encontrado');
        } else {
            const contentType = getContentType(filePath);
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data);
        }
    });
}

// Función para obtener el tipo de contenido
function getContentType(filePath) {
    const ext = path.extname(filePath);
    switch (ext) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.ico': return 'image/x-icon';
        default: return 'text/plain';
    }
}

// Función para servir archivos HTML (index.html, menu.html, etc.)
function serveFile(filename, response) {
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Error interno del servidor');
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        }
    });
}

const port = 9000;
const host = '0.0.0.0';

server.listen(port, host, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
