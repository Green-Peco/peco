// tests/setup.js
const { initializeDb } = require('../data/initialize-db');
const db = require('../data/db-wrapper');
const dbPromise = require('../data/database');

// Set the environment for tests
process.env.DB_PATH = ':memory:';
process.env.SESSION_SECRET = 'a-super-secret-test-key';

// This runs once before any tests in a file start
beforeAll(async () => {
    await initializeDb();
});

// Runs before each individual test in a file
beforeEach(async () => {
    await db.run('DELETE FROM user_achievements');
    await db.run('DELETE FROM user_progress');
    await db.run('DELETE FROM users');
});

// This runs once after all tests in a file complete
afterAll(async () => {
    const dbInstance = await dbPromise;
    if (dbInstance) {
        await new Promise(resolve => dbInstance.close(resolve));
    }
});