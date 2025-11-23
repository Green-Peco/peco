const request = require('supertest');
const app = require('../serve'); // Adjust this path if your app entry point is different

describe('GET /', () => {
    it('should respond with a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Welcome to the PECO Backend API!');
    });
});
