module.exports = {
    index(request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Welcome to note app!');
    }
}