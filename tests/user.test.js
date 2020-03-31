const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');
const {user1, setupDatabase} = require('./fixtures/db');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  await setupDatabase();
});

afterAll(async () => {
  // await mongoose.connection.close();
});

describe('Test POST /users', () => {

  test('Should create a new user with valid data', async() => {
    const response = await request(app).post('/users').send({
      name: 'Elsa',
      email: 'elsa@queen.com',
      password: 'letitgo',
      finnhubToken: process.env.FINNHUB_TOKEN2
    }).expect(201);

    // Assert the newly created user in in database
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the responses
    expect(response.body).toMatchObject({
      user: {
        name: 'elsa',
        email: 'elsa@queen.com',
        finnhubToken: process.env.FINNHUB_TOKEN2,
        public: false
      },
      token: user.jsonWebTokens[0].jsonWebToken
    });
  });

  test('Should not create a user with duplicated username', async () => {
    const response = await request(app).post('/users').send({
      name: 'Elsa',
      email: 'elsa@queen.com',
      password: 'letitgo',
      finnhubToken: ''
    }).expect(400);
  })

  test('Should not create a user with invalid email', async () => {
    const response = await request(app).post('/users').send({
      name: 'Gina',
      email: 'gina.tw',
      password: 'ggggg',
      finnhubToken: ''
    }).expect(400);
  });

  test('Should not create a user with invalid Finnhub API token', async () => {
    const response = await request(app).post('/users').send({
      name: 'Gina',
      email: 'gina@yahoo.tw',
      password: 'ggggg',
      // finnhubToken: 'invalid'
    }).expect(400);
  })

});

describe('Test DELETE /users', () => {
  
});
