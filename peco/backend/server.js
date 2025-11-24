// server.js
const app = require('./serve');
const { initializeDb } = require('./data/initialize-db');

const port = process.env.PORT || 3000;

async function startServer() {
    await initializeDb();
    const server = app.listen(port, () => {
        console.log(`PECO server listening on port ${port}`);
    });
    return server;
}

const serverPromise = startServer();

module.exports = serverPromise;