const request = require('supertest');
const app = require('../serve');

describe('Course Endpoints', () => {

    it('should fetch all courses', async () => {
        const agent = request.agent(app);
        await agent.post('/api/v1/auth/register').send({ username: 'tester', password: 'password' });
        await agent.post('/api/v1/auth/login').send({ username: 'tester', password: 'password' });

        const res = await agent.get('/api/v1/courses');
        expect(res.statusCode).toEqual(200);
        expect(res.body.courses).toBeInstanceOf(Array);
        expect(res.body.courses.length).toBeGreaterThan(0);
    });
    
    it('should complete a lesson and get an achievement', async () => {
        const agent = request.agent(app);
        await agent.post('/api/v1/auth/register').send({ username: 'tester', password: 'password' });
        await agent.post('/api/v1/auth/login').send({ username: 'tester', password: 'password' });

        const res = await agent
            .post('/api/v1/courses/lessons/101/complete')
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'Completed');
        expect(res.body.newly_awarded_achievements.length).toBe(1);
        expect(res.body.newly_awarded_achievements[0].id).toBe('first_lesson');
    });

    it('should not award points for a re-completed lesson', async () => {
        const agent = request.agent(app);
        await agent.post('/api/v1/auth/register').send({ username: 'tester', password: 'password' });
        await agent.post('/api/v1/auth/login').send({ username: 'tester', password: 'password' });
        
        // Complete once
        await agent.post('/api/v1/courses/lessons/101/complete').send();
        
        // Complete a second time
        const res = await agent.post('/api/v1/courses/lessons/101/complete').send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'Already Completed');
        expect(res.body.xp_awarded).toBe(0);
    });
});