// Servidor local de desarrollo ligero (Cero dependencias)
// Evita problemas de CORS al ejecutar módulos ES6 de forma local.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  console.log(`[PETICIÓN] ${req.method} ${req.url}`);

  // Limpiar URL de parámetros de consulta
  let filePath = req.url.split('?')[0];

  if (filePath === '/') {
    filePath = '/index.html';
  }

  const absolutePath = path.join(__dirname, filePath);
  const extname = path.extname(absolutePath).toLowerCase();

  // Validar que el archivo esté dentro del directorio del espacio de trabajo
  if (!absolutePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acceso denegado.');
    return;
  }

  fs.readFile(absolutePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Archivo no encontrado
        console.log(`[404] No encontrado: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Archivo no encontrado</h1><p>Verifique la ruta del archivo.</p>');
      } else {
        // Error de lectura de archivo
        console.log(`[500] Error de lectura: ${err.code}`);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Error interno del servidor: ${err.code}`);
      }
    } else {
      // Éxito - Servir el archivo con su tipo MIME correspondiente
      const contentType = MIME_TYPES[extname] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`   ¡Servidor de Paraatletismo del Valle en funcionamiento!`);
  console.log(`   Dirección local: http://localhost:3000`);
  console.log(`   Presione Ctrl+C para detener el servidor.`);
  console.log(`=============================================================`);
});

