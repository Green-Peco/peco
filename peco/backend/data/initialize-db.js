// data/initialize-db.js
const { run } = require('./db-wrapper');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function initializeDb() {
    await run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        streak INTEGER DEFAULT 0,
        last_lesson_date TEXT,
        isAdmin INTEGER DEFAULT 0
    )`);

    // ... (rest of the table creation)
    await run(`CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)`);
    await run(`CREATE TABLE IF NOT EXISTS units (id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER, title TEXT NOT NULL, FOREIGN KEY (course_id) REFERENCES courses(id))`);
    await run(`CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY, unit_id INTEGER, title TEXT NOT NULL, type TEXT NOT NULL, content TEXT, video_url TEXT, xp_reward INTEGER, FOREIGN KEY (unit_id) REFERENCES units(id))`);
    await run(`CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, lesson_id INTEGER, question TEXT NOT NULL, correct_answer TEXT NOT NULL, FOREIGN KEY (lesson_id) REFERENCES lessons(id))`);
    await run(`CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY AUTOINCREMENT, question_id INTEGER, option_id TEXT NOT NULL, text TEXT NOT NULL, FOREIGN KEY (question_id) REFERENCES questions(id))`);
    await run(`CREATE TABLE IF NOT EXISTS user_progress (user_id INTEGER, lesson_id INTEGER, completed_at TEXT, PRIMARY KEY (user_id, lesson_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (lesson_id) REFERENCES lessons(id))`);
    await run(`CREATE TABLE IF NOT EXISTS achievements (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, criteria_type TEXT NOT NULL, criteria_value INTEGER NOT NULL)`);
    await run(`CREATE TABLE IF NOT EXISTS user_achievements (user_id INTEGER, achievement_id TEXT, earned_at TEXT NOT NULL, PRIMARY KEY (user_id, achievement_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (achievement_id) REFERENCES achievements(id))`);

    console.log('Database tables created or already exist.');
    await seedData();
}

async function seedData() {
    // Seed Demo User
    const demoUserExists = await require('./db-wrapper').get(`SELECT id FROM users WHERE username = ?`, ['peco@gmail.com']);
    if (!demoUserExists) {
        console.log('Creating demo user...');
        const hash = await bcrypt.hash('123', saltRounds);
        await run(`INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)`, ['peco@gmail.com', hash, 1]);
    }
    
    // Seed Achievements
    await run(`INSERT OR IGNORE INTO achievements (id, name, description, criteria_type, criteria_value) VALUES
        ('first_lesson', 'First Step', 'Complete your first lesson.', 'lessons_completed', 1),
        ('ten_lessons', 'Getting the Hang of It', 'Complete 10 lessons.', 'lessons_completed', 10),
        ('streak_3', 'On a Roll', 'Maintain a 3-day streak.', 'streak', 3),
        ('streak_7', 'Week of Green', 'Maintain a 7-day streak.', 'streak', 7)
    `);

    // Seed Course Data
    const courseDataPath = path.join(__dirname, 'course_data.json');
    const courseData = JSON.parse(fs.readFileSync(courseDataPath, 'utf-8'));
    const course = courseData.course;

    const existingCourse = await require('./db-wrapper').get(`SELECT id FROM courses WHERE title = ?`, [course.title]);
    if (existingCourse) {
        return; // Course data already seeded
    }

    console.log('Seeding course data...');
    const courseResult = await run(`INSERT INTO courses (title) VALUES (?)`, [course.title]);
    const courseId = courseResult.lastID;

    for (const unit of course.units) {
        const unitResult = await run(`INSERT INTO units (course_id, title) VALUES (?, ?)`, [courseId, unit.title]);
        const unitId = unitResult.lastID;

        for (const lesson of unit.lessons) {
            await run(`INSERT INTO lessons (id, unit_id, title, type, content, video_url, xp_reward) VALUES (?, ?, ?, ?, ?, ?, ?)`, [lesson.lesson_id, unitId, lesson.title, lesson.type, lesson.content, lesson.video_url, lesson.xp_reward]);
            
            if (lesson.type === 'quiz') {
                for (const question of lesson.questions) {
                    await run(`INSERT INTO questions (id, lesson_id, question, correct_answer) VALUES (?, ?, ?, ?)`, [question.question_id, lesson.lesson_id, question.question, question.correct_answer]);
                    
                    for (const option of question.options) {
                        await run(`INSERT INTO options (question_id, option_id, text) VALUES (?, ?, ?)`, [question.question_id, option.option_id, option.text]);
                    }
                }
            }
        }
    }
    console.log('Database seeding complete.');
}

module.exports = { initializeDb };