const db = require('../data/db-wrapper');

exports.createCommunity = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.session.userId; // Admin check happens in middleware

    if (!name) {
        return res.status(400).json({ error: 'Community name cannot be empty.' });
    }

    try {
        // Create community
        const result = await db.run(
            `INSERT INTO Communities (name, description) VALUES (?, ?)`,
            [name, description]
        );
        const communityId = result.lastID;

        // Auto-create a chat room for the community
        const chatRoomResult = await db.run(
            `INSERT INTO Chat_Rooms (is_group, name, community_id) VALUES (?, ?, ?)`,
            [true, `Community Chat: ${name}`, communityId]
        );
        const chatRoomId = chatRoomResult.lastID;

        // Add creator as a participant and admin of the chat room
        await db.run(
            `INSERT INTO Chat_Participants (room_id, user_id, role) VALUES (?, ?, ?)`,
            [chatRoomId, userId, 'admin']
        );

        res.status(201).json({ message: 'Community created successfully.', communityId: communityId, chatRoomId: chatRoomId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCommunities = async (req, res) => {
    try {
        const communities = await db.all(
            `SELECT id, name, description, created_at FROM Communities ORDER BY name ASC`
        );
        res.json({ communities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCommunityById = async (req, res) => {
    const communityId = req.params.communityId;
    try {
        const community = await db.get(
            `SELECT id, name, description, created_at FROM Communities WHERE id = ?`,
            [communityId]
        );
        if (!community) {
            return res.status(404).json({ error: 'Community not found.' });
        }

        // Also fetch posts belonging to this community (assuming posts can be linked to communities)
        // This links Posts to Chat_Rooms' community_id, then to Communities
        const posts = await db.all(
            `SELECT p.id, p.content, p.media_url, p.tags, p.report_count, p.created_at, u.username AS author
             FROM Posts p
             JOIN Users u ON p.user_id = u.id
             WHERE p.id IN (
                SELECT id FROM Posts -- This subquery needs to be re-evaluated
             )
             ORDER BY p.created_at DESC`
        );
        // Correct query to link posts to community based on Chat_Rooms
        // This is a complex join, let's simplify for now: assume posts are not directly linked to communities yet.
        // For now, just return community details. If posts are needed, a FK on Posts to Community is better.
        
        // Simpler for now: fetch posts from users who are part of this community's main chat?
        // Let's defer linking posts to communities directly for this endpoint
        res.json({ community });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.joinCommunity = async (req, res) => {
    const communityId = req.params.communityId;
    const userId = req.session.userId;

    try {
        // Check if user is already a member
        const existingParticipant = await db.get(
            `SELECT cp.user_id FROM Chat_Rooms cr JOIN Chat_Participants cp ON cr.id = cp.room_id WHERE cr.community_id = ? AND cp.user_id = ?`,
            [communityId, userId]
        );
        if (existingParticipant) {
            return res.status(400).json({ error: 'User is already a member of this community.' });
        }

        // Find the main chat room for this community
        const chatRoom = await db.get(`SELECT id FROM Chat_Rooms WHERE community_id = ? AND is_group = TRUE`, [communityId]);
        if (!chatRoom) {
            return res.status(404).json({ error: 'Community chat room not found.' });
        }

        // Add user to chat room participants
        await db.run(
            `INSERT INTO Chat_Participants (room_id, user_id, role) VALUES (?, ?, ?)`,
            [chatRoom.id, userId, 'member']
        );

        res.status(200).json({ message: 'Successfully joined community.', chatRoomId: chatRoom.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
