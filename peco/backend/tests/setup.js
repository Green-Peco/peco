const path = require('path');

// Set up a dedicated test database
process.env.DB_PATH = ':memory:';
process.env.SESSION_SECRET = 'test-secret';

// Since we're using an in-memory DB, we need to ensure the database
// module is re-initialized for tests. We can do this by clearing the
// cache for the database module.
jest.mock('../data/database.js', () => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(':memory:');
    // We need to manually run the initialization logic from database.js
    // This is a simplified version for testing purposes.
    // In a more complex app, you might have a dedicated test DB setup function.
    const initializeTestDb = () => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, xp INTEGER, level INTEGER, streak INTEGER, last_lesson_date TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, title TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS units (id INTEGER PRIMARY KEY, course_id INTEGER, title TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY, unit_id INTEGER, title TEXT, type TEXT, content TEXT, video_url TEXT, xp_reward INTEGER)`);
            db.run(`CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, lesson_id INTEGER, question TEXT, correct_answer TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, question_id INTEGER, option_id TEXT, text TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS user_progress (user_id INTEGER, lesson_id INTEGER, completed_at TEXT)`);
        });
    };
    initializeTestDb();
    return db;
});
