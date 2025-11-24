const db = require('../data/db-wrapper');

exports.getChatRooms = async (req, res) => {
    const userId = req.session.userId;

    try {
        const rooms = await db.all(
            `SELECT cr.id, cr.name, cr.is_group, cr.community_id
             FROM Chat_Rooms cr
             JOIN Chat_Participants cp ON cr.id = cp.room_id
             WHERE cp.user_id = ?`,
            [userId]
        );
        res.json({ rooms });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    const roomId = req.params.roomId;
    const userId = req.session.userId;

    try {
        // Verify user is a participant of the room
        const isParticipant = await db.get(
            `SELECT 1 FROM Chat_Participants WHERE room_id = ? AND user_id = ?`,
            [roomId, userId]
        );
        if (!isParticipant) {
            return res.status(403).json({ error: 'Forbidden: Not a participant of this chat room.' });
        }

        const messages = await db.all(
            `SELECT m.id, m.content, m.media_url, m.message_type, m.created_at, m.sender_id, u.username AS sender_username
             FROM Messages m
             JOIN Users u ON m.sender_id = u.id
             WHERE m.room_id = ? ORDER BY m.created_at ASC`,
            [roomId]
        );
        res.json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendMessage = async (data, io) => {
    // This function is called by the Socket.IO event handler, not directly by Express route
    const { roomId, senderId, content, mediaUrl, messageType, replyToId } = data;

    try {
        // Verify user is a participant of the room
        const isParticipant = await db.get(
            `SELECT 1 FROM Chat_Participants WHERE room_id = ? AND user_id = ?`,
            [roomId, senderId]
        );
        if (!isParticipant) {
            // How to handle errors for socket? Emit back to sender or just log?
            console.error(`User ${senderId} is not a participant of room ${roomId}. Message not sent.`);
            return;
        }

        const result = await db.run(
            `INSERT INTO Messages (room_id, sender_id, content, media_url, message_type, reply_to_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [roomId, senderId, content, mediaUrl, messageType, replyToId]
        );

        const newMessage = {
            id: result.lastID,
            roomId,
            senderId,
            content,
            mediaUrl,
            messageType,
            replyToId,
            created_at: new Date().toISOString(),
            sender_username: (await db.get(`SELECT username FROM Users WHERE id = ?`, [senderId])).username
        };

        io.to(roomId).emit('receiveMessage', newMessage);
        return newMessage;
    } catch (err) {
        console.error("Error saving message or broadcasting:", err.message);
        return null;
    }
};
