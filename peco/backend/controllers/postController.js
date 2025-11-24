const db = require('../data/db-wrapper');

exports.createPost = async (req, res) => {
    const { content, media_url, tags } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'You must be logged in to create a post.' });
    }
    if (!content) {
        return res.status(400).json({ error: 'Post content cannot be empty.' });
    }

    try {
        const result = await db.run(
            `INSERT INTO Posts (user_id, content, media_url, tags) VALUES (?, ?, ?, ?)`,
            [userId, content, media_url, tags ? JSON.stringify(tags) : null] // Tags handled as JSON string for now
        );
        res.status(201).json({ message: 'Post created successfully.', postId: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await db.all(
            `SELECT p.id, p.content, p.media_url, p.tags, p.report_count, p.created_at, u.username AS author
             FROM Posts p JOIN Users u ON p.user_id = u.id
             ORDER BY p.created_at DESC`
        );
        // Parse tags if stored as JSON string
        posts.forEach(post => {
            if (post.tags) {
                try {
                    post.tags = JSON.parse(post.tags);
                } catch (e) {
                    post.tags = []; // Fallback if parsing fails
                }
            } else {
                post.tags = [];
            }
        });
        res.json({ posts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await db.get(
            `SELECT p.id, p.content, p.media_url, p.tags, p.report_count, p.created_at, u.username AS author
             FROM Posts p JOIN Users u ON p.user_id = u.id
             WHERE p.id = ?`,
            [postId]
        );
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        // Parse tags if stored as JSON string
        if (post.tags) {
            try {
                post.tags = JSON.parse(post.tags);
            } catch (e) {
                post.tags = [];
            }
        } else {
            post.tags = [];
        }
        res.json({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
