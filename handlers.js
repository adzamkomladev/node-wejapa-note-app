const fs = require('fs');

module.exports = {
    index(request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Welcome to note app!');
    },
    addNote(request, response) {
        let body = [];

        request.on('data', chunk => body.push(chunk)).on('end', () => {
            body = Buffer.concat(body).toString();
            if (!body) {
                invalidResponse(response, 400, 'The body provided is invalid!', body);
                return;
            }
            body = JSON.parse(body);

            const { topic, note } = body;
            if (!topic || !note) {
                invalidResponse(response, 400, 'The body provided is invalid!', body);
                return;
            }
            const name = addFile(topic, note) || '';

            const data = { topic, note, name };

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(data));
        });
    },
    updateNote(request, response) {
        const { url } = request;
        const [_, __, topic, fileName] = url.split('/');

        if (!topic || !fileName) {
            invalidResponse(response, 400, 'Invalid url parameters provided!', url);
            return;
        }

        let body = [];

        request.on('data', chunk => body.push(chunk)).on('end', () => {
            body = Buffer.concat(body).toString();
            if (!body) {
                invalidResponse(response, 400, 'The body provided is invalid!', body);
                return;
            }
            body = JSON.parse(body);

            const { note } = body;

            if (!note) {
                invalidResponse(response, 400, 'The body provided is invalid!', body);
                return;
            }

            if (!updateFile(topic, fileName, note)) {
                invalidResponse(response, 404, 'Note not found!', url);
                return;
            }

            response.statusCode = 204;
            response.setHeader('Content-Type', 'text/plain');
            response.end('');
        });
    }
}

const addFile = (topic, data) => {
    const directory = `./notes/${topic}`;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    const fileName = `note_${Date.now()}.txt`;
    const filePath = `${directory}/${fileName}`;

    fs.writeFileSync(filePath, data);

    return fileName;
};

const updateFile = (topic, fileName, data) => {
    const filePath = `./notes/${topic}/${fileName}.txt`;

    if (!fs.existsSync(filePath)) {
        return false;
    }

    try {
        fs.writeFileSync(filePath, data);
        return true;
    } catch (error) {
        return false;
    }
};

const invalidResponse = (response, errorCode, message, data = '') => {
    response.statusCode = errorCode;
    response.setHeader('Content-Type', 'text/plain');
    response.end(`${message} ${JSON.stringify(data)}`);
};