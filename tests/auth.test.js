const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

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

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Field Validation & Auth API Tests', () => {
  const validUser = {
    name: 'Test User',
    username: 'testuser123',
    email: 'test123@example.com',
    password: 'SecurePassword@12345',
    phone_number: '1234567890'
  };

  let token = '';

  it('should fail registration if username contains spaces', async () => {
    const invalidUser = { ...validUser, username: 'test user with space', email: 'space@example.com' };
    const res = await request(app)
      .post('/api/users/register')
      .send(invalidUser);

    expect(res.statusCode).toEqual(400);
  });

  it('should fail registration if password is too short or lacks complexity', async () => {
    const weakUser = { ...validUser, username: 'weakpassuser', email: 'weak@example.com', password: 'password123' };
    const res = await request(app)
      .post('/api/users/register')
      .send(weakUser);

    expect(res.statusCode).toEqual(400);
  });

  it('should successfully register a user with valid strict fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(validUser);

    if (res.statusCode !== 201 && res.statusCode !== 200) {
      console.log('? Registration Error Details:', res.body);
    }

    expect([201, 200]).toContain(res.statusCode);
  });

  it('should login the user and return a token', async () => {
    // Register user first for this test context
    await request(app).post('/api/users/register').send(validUser);

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: validUser.email,
        password: validUser.password
      });

    if (res.statusCode !== 200) {
      console.log('? Login Error Details:', res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should access protected user profile with token', async () => {
    // Register and login to get fresh token
    await request(app).post('/api/users/register').send(validUser);
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: validUser.email, password: validUser.password });
    
    token = loginRes.body.token;

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', validUser.email);
  });
});
