// services/achievementService.js
const db = require('../data/db-wrapper');

async function checkAndAwardAchievements(userId) {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return;

    const userProgressCount = (await db.get('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?', [userId])).count;
    
    const achievements = await db.all('SELECT * FROM achievements');
    const userAchievements = await db.all('SELECT achievement_id FROM user_achievements WHERE user_id = ?', [userId]);
    const userAchievementIds = userAchievements.map(a => a.achievement_id);

    const newlyAwarded = [];

    for (const achievement of achievements) {
        if (userAchievementIds.includes(achievement.id)) {
            continue; // Already earned
        }

        let earned = false;
        if (achievement.criteria_type === 'lessons_completed' && userProgressCount >= achievement.criteria_value) {
            earned = true;
        } else if (achievement.criteria_type === 'streak' && user.streak >= achievement.criteria_value) {
            earned = true;
        }

        if (earned) {
            await db.run('INSERT INTO user_achievements (user_id, achievement_id, earned_at) VALUES (?, ?, ?)', [userId, achievement.id, new Date().toISOString()]);
            newlyAwarded.push(achievement);
        }
    }

    return newlyAwarded;
}

module.exports = {
    checkAndAwardAchievements
};
