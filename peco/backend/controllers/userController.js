const db = require('../data/db-wrapper');

exports.getUserProfile = async (req, res) => {
    // ... (existing code)
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });

    try {
        const user = await db.get(`SELECT id, username, xp, level, streak, last_lesson_date FROM users WHERE id = ?`, [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserProgress = async (req, res) => {
    // ... (existing code)
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });

    try {
        const sql = `
            SELECT l.id, l.title, l.type, up.completed_at
            FROM user_progress up
            JOIN lessons l ON up.lesson_id = l.id
            WHERE up.user_id = ?
        `;
        const progress = await db.all(sql, [userId]);
        res.json({ progress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserAchievements = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });

    try {
        const sql = `
            SELECT a.id, a.name, a.description, ua.earned_at
            FROM user_achievements ua
            JOIN achievements a ON ua.achievement_id = a.id
            WHERE ua.user_id = ?
        `;
        const achievements = await db.all(sql, [userId]);
        res.json({ achievements });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const sql = `
            SELECT username, xp, level 
            FROM users
            ORDER BY xp DESC
            LIMIT ?
        `;
        const leaderboard = await db.all(sql, [limit]);
        res.json({ leaderboard });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
