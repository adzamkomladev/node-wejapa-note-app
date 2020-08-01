const http = require('http');

const { index, addNote, updateNote } = require('./handlers');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {

    const { url, method } = request;

    if (url === '/' && method === 'GET') {
        index(request, response);
    } else if (method === 'POST' && url === '/notes') {
        addNote(request, response);
    } else if (method === 'PUT' && url.startsWith('/notes')) {
        updateNote(request, response);
    } else if (method === 'DELETE' && url === '/notes') {

    } else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.end(`Route '${url}' with method '${method}' does not exist`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});