// tests/locations.test.js
const request = require('supertest');
const app = require('../server');
const db = require('../db/index');
const Location = require('../models/Location');

let userToken;

beforeAll(async () => {
    // Create a user only once before all tests
    const userResponse = await request(app)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
  
    // Optionally, check the user creation response
    expect(userResponse.status).toBe(201);
});

beforeEach(async () => {
// Log in and get the token before each test
const loginResponse = await request(app)
    .post('/auth/login')
    .send({
    username: 'testuser',
    password: 'password123',
    });

userToken = loginResponse.body.token;  // Save the user's JWT token for authentication

// Optionally check that the login succeeded
expect(loginResponse.status).toBe(200);
expect(userToken).toBeDefined();
});

afterEach(async () => {
// Remove locations but leave users intact
await db.query('DELETE FROM locations');
});

afterAll(async () => {
// Optionally, remove the user at the end (if needed)
await db.query('DELETE FROM users WHERE username = $1', ['testuser']);
});

describe('POST /locations', () => {
  it('should create a new location', async () => {
    const location = {
      name: 'Home',
      address: '123 Test St, Test City, TC',
    };

    const response = await request(app)
      .post('/locations')
      .set('Authorization', `Bearer ${userToken}`)
      .send(location)
      .expect(201);

    expect(response.body.name).toBe(location.name);
    expect(response.body.address).toBe(location.address);
  });
});

describe('PUT /locations/:id', () => {
  it('should update a location', async () => {
    // First create a location to update
    const location = await Location.create({
      userId: userToken,
      name: 'Office',
      address: '456 Office Rd',
    });

    const updatedLocation = {
      name: 'Updated Office',
      address: '789 New Office Rd',
    };

    const response = await request(app)
      .put(`/locations/${location.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updatedLocation)
      .expect(200);

    expect(response.body.name).toBe(updatedLocation.name);
    expect(response.body.address).toBe(updatedLocation.address);
  });
});

describe('DELETE /locations/:id', () => {
  it('should delete a location', async () => {
    // First create a location to delete
    const location = await Location.create({
      userId: userToken,
      name: 'Old Location',
      address: '789 Old Rd',
    });

    const response = await request(app)
      .delete(`/locations/${location.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(204);

    // Check if the location was successfully deleted
    const deletedLocation = await Location.findById(location.id);
    expect(deletedLocation).toBeNull();
  });
});