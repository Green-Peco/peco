const request = require('supertest');
const app = require('../serve');

describe('Auth Endpoints', () => {

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'testuser', password: 'password123' });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully.');
  });
  
  it('should log in an existing user', async () => {
    // First, register a user
    await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'loginuser', password: 'password123' });

    // Then, log in
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'loginuser', password: 'password123' });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful.');
  });

  it('should fail to register a duplicate user', async () => {
      await request(app)
          .post('/api/v1/auth/register')
          .send({ username: 'duplicate', password: 'password123' });
      
      const res = await request(app)
          .post('/api/v1/auth/register')
          .send({ username: 'duplicate', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Username already taken.');
  });
});
