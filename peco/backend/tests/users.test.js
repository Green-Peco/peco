const request = require('supertest');
const app = require('../serve');
const db = require('../data/db-wrapper');

describe('User Endpoints', () => {

    describe('GET /api/v1/users/profile', () => {
        it('should fetch the profile for a logged-in user', async () => {
            await db.run('DELETE FROM users');
            const agent = request.agent(app);

            // Register and Login
            await agent.post('/api/v1/auth/register').send({ username: 'profileuser', password: 'password123' });
            await agent.post('/api/v1/auth/login').send({ username: 'profileuser', password: 'password123' });

            // Fetch profile
            const res = await agent.get('/api/v1/users/profile');
            expect(res.statusCode).toEqual(200);
            expect(res.body.user).toHaveProperty('username', 'profileuser');
        });
    });

    describe('GET /api/v1/users/leaderboard', () => {
        it('should return users ordered by XP', async () => {
            // Setup a clean state for this specific test
            await db.run('DELETE FROM users');
            await db.run("INSERT INTO users (username, password, xp) VALUES ('userA', 'pw', 100)");
            await db.run("INSERT INTO users (username, password, xp) VALUES ('userB', 'pw', 300)");
            await db.run("INSERT INTO users (username, password, xp) VALUES ('userC', 'pw', 200)");

            const res = await request(app).get('/api/v1/users/leaderboard');
            
            expect(res.statusCode).toEqual(200);
            const leaderboard = res.body.leaderboard;
            expect(leaderboard.length).toBe(3);
            expect(leaderboard[0].username).toBe('userB');
            expect(leaderboard[1].username).toBe('userC');
            expect(leaderboard[2].username).toBe('userA');
        });
    });
});