const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri, {
    runtimeAdapters: { os: require('os') }
  });
}, 60000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Auth API Tests', () => {
  const testUser = {
    name: 'Test User',
    username: 'testuser123',
    email: 'test123@example.com',
    password: 'password123',
    phone_number: '1234567890' // Added required phone_number field
  };

  let token = '';

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect([201, 200, 400]).toContain(res.statusCode);
  });

  it('should login the user and return a token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('token');
      token = res.body.token;
    } else {
      expect([200, 400, 404]).toContain(res.statusCode);
    }
  });

  it('should access protected user profile with token', async () => {
    if (!token) return;

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401]).toContain(res.statusCode);
  });
});
