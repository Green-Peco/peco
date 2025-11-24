const request = require('supertest');
const app = require('../serve');
const db = require('../data/db-wrapper');

describe('Admin Endpoints', () => {

    it('should allow an admin to create a course', async () => {
        // Setup admin user
        const adminAgent = request.agent(app);
        const adminRes = await adminAgent.post('/api/v1/auth/register').send({ username: 'admin', password: 'password' });
        await db.run('UPDATE users SET isAdmin = 1 WHERE id = ?', [adminRes.body.userId]);
        await adminAgent.post('/api/v1/auth/login').send({ username: 'admin', password: 'password' });
        
        // Test create course
        const res = await adminAgent
            .post('/api/v1/admin/courses')
            .send({ title: 'Admin Course' });
        expect(res.statusCode).toEqual(201);
    });

    it('should forbid a non-admin from creating a course', async () => {
        // Setup regular user
        const userAgent = request.agent(app);
        await userAgent.post('/api/v1/auth/register').send({ username: 'user', password: 'password' });
        await userAgent.post('/api/v1/auth/login').send({ username: 'user', password: 'password' });

        // Test create course
        const res = await userAgent
            .post('/api/v1/admin/courses')
            .send({ title: 'User Course' });
        expect(res.statusCode).toEqual(403);
    });

    it('should block an unauthenticated user from creating a course', async () => {
        const res = await request(app)
            .post('/api/v1/admin/courses')
            .send({ title: 'Anon Course' });
        expect(res.statusCode).toEqual(401); // Correct expectation is 401
    });
});
