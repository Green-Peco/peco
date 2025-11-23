const db = require('../data/database');

// GET /api/users/profile
exports.getUserProfile = (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    const sql = `SELECT id, username, xp, level, streak, last_lesson_date FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ user });
    });
};

// GET /api/users/progress
exports.getUserProgress = (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    const sql = `
        SELECT l.id, l.title, l.type, up.completed_at
        FROM user_progress up
        JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = ?
    `;
    db.all(sql, [userId], (err, progress) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ progress });
    });
};
