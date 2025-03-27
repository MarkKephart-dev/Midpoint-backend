// tests/auth.test.js
const request = require('supertest');
const app = require('../server'); 
const User = require('../models/User');

beforeAll(async () => {
    await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
});

afterAll(async () => {
  
});

describe('POST /auth/login', () => {
  it('should login a user and return a JWT', async () => {
    const user = {
      username: 'testuser',
      password: 'password123',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(200);

    expect(response.body.token).toBeDefined();  // Check if JWT is returned
  });

  it('should return 400 for invalid credentials', async () => {
    const user = {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(400);

    expect(response.body.error).toBe('Invalid username/password');
  });
});