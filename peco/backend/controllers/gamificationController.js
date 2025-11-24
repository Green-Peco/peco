const db = require('../data/db-wrapper');
const achievementService = require('../services/achievementService');

exports.completeLesson = async (req, res) => {
    const { answers } = req.body;
    const { lessonId } = req.params;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: 'You must be logged in.' });

    try {
        const lesson = await db.get('SELECT * FROM lessons WHERE id = ?', [lessonId]);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });

        const existingProgress = await db.get('SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?', [userId, lessonId]);
        if (existingProgress) {
            const nextLessonId = await findNextLessonId(lessonId);
            return res.json({ status: 'Already Completed', message: 'You have already completed this lesson.', xp_awarded: 0, next_lesson_id: nextLessonId });
        }

        if (lesson.type === 'quiz') {
            await handleQuiz(req, res, userId, lesson, answers);
        } else {
            await handleNonQuiz(req, res, userId, lesson);
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while processing the lesson completion.', details: err.message });
    }
};

async function handleQuiz(req, res, userId, lesson, answers) {
    const questions = await db.all('SELECT id, correct_answer FROM questions WHERE lesson_id = ?', [lesson.id]);
    const correctAnswersCount = questions.reduce((count, q) => {
        const userAnswer = (answers || []).find(a => a.questionId === q.id);
        return (userAnswer && userAnswer.answerId === q.correct_answer) ? count + 1 : count;
    }, 0);

    const scorePercentage = questions.length > 0 ? (correctAnswersCount / questions.length) * 100 : 100;

    if (scorePercentage < 70) {
        return res.json({ status: 'Failed', message: `You scored ${scorePercentage.toFixed(0)}%. You need at least 70% to pass.`, xp_awarded: 0 });
    }

    await completeAndReward(res, userId, lesson, `${scorePercentage.toFixed(0)}%`);
}

async function handleNonQuiz(req, res, userId, lesson) {
    await completeAndReward(res, userId, lesson, '100%');
}

async function completeAndReward(res, userId, lesson, score) {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = user.last_lesson_date === yesterday ? user.streak + 1 : (user.last_lesson_date !== today ? 1 : user.streak);

    const xp_awarded = lesson.xp_reward || 10;
    const newXp = user.xp + xp_awarded;
    const newLevel = Math.floor(newXp / 1000) + 1;

    await db.run('BEGIN TRANSACTION');
    try {
        await db.run('UPDATE users SET xp = ?, level = ?, streak = ?, last_lesson_date = ? WHERE id = ?', [newXp, newLevel, newStreak, today, userId]);
        await db.run('INSERT INTO user_progress (user_id, lesson_id, completed_at) VALUES (?, ?, ?)', [userId, lesson.id, new Date().toISOString()]);
        
        // Check for achievements
        const newAchievements = await achievementService.checkAndAwardAchievements(userId);

        await db.run('COMMIT');

        const nextLessonId = await findNextLessonId(lesson.id);
        res.json({ 
            status: 'Completed', 
            score, 
            xp_awarded, 
            streak: newStreak, 
            level_up: newLevel > user.level, 
            next_lesson_id: nextLessonId,
            newly_awarded_achievements: newAchievements
        });
    } catch (err) {
        await db.run('ROLLBACK');
        throw err;
    }
}

async function findNextLessonId(currentLessonId) {
    const currentLesson = await db.get('SELECT unit_id FROM lessons WHERE id = ?', [currentLessonId]);
    if (!currentLesson) return null;

    let nextLesson = await db.get(`SELECT id FROM lessons WHERE unit_id = ? AND id > ? ORDER BY id ASC LIMIT 1`, [currentLesson.unit_id, currentLessonId]);
    if (nextLesson) return nextLesson.id;

    const nextUnitLesson = await db.get(`
        SELECT l.id FROM lessons l
        JOIN units u ON l.unit_id = u.id
        WHERE u.course_id = (SELECT course_id FROM units WHERE id = ?) AND u.id > ?
        ORDER BY u.id ASC, l.id ASC LIMIT 1`,
        [currentLesson.unit_id, currentLesson.unit_id]
    );
    return nextUnitLesson ? nextUnitLesson.id : null;
}