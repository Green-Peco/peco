// server.js
const app = require('./serve');
const { initializeDb } = require('./data/initialize-db');
const http = require('http');
const { Server } = require('socket.io');
const chatController = require('./controllers/chatController');

const port = process.env.PORT || 3000;

async function startServer() {
    await initializeDb();
    
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins for development, restrict in production
            methods: ["GET", "POST"]
        }
    });

    // --- Socket.IO Event Handling ---
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('sendMessage', async (data) => {
            console.log(`Message received in room ${data.roomId} from ${data.senderId}: ${data.content}`);
            // Call chatController to save message to DB and then broadcast
            await chatController.sendMessage(data, io);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`PECO server listening on port ${port} (HTTP & WebSockets)`);
    });
    
    return httpServer;
}

const serverPromise = startServer();

module.exports = serverPromise;
