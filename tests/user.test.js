const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = require('../src/app');
const User = require('../src/models/user');
const {user1, user1auth, setupDatabase} = require('./fixtures/db');

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  await setupDatabase();
});

// afterAll(async () => {
//   // await mongoose.connection.close();
// });

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
      finnhubToken: ''
    }).expect(400);
  })

  test('Should login with valid username and password', async () => {
    await request(app)
      .post('/users/login')
      .send({
        name: user1.name,
        password: user1.password
      })
      .expect(200);
  });

  test('Should not login with non-existing username', async () => {
    await request(app)
      .post('/users/login')
      .send({
        name: 'Wagamama',
        passowrd: 'test'
      })
      .expect(400);
  });

  test('Should not login with invalid password', async () => {
    await request(app)
      .post('/users/login')
      .send({
        name: user1.name,
        passowrd: 'invalid'
      })
      .expect(400);
  });

  test('Should logout with authentication', async () => {
    await request(app)
      .post('/users/logout')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);

    // Assert the token is removed from user profile in database
    const user = await User.findById(user1._id);
    const foundToken = await user.jsonWebTokens.filter((token) => token.token === user1.jsonWebTokens[0].jsonWebToken);
    expect(foundToken.length).toBe(0);
  });

  test('Should not logout without authentication', async () => {
    await request(app)
      .post('/users/logout')
      .send()
      .expect(401);
  });

});

describe('Test DELETE /users', () => {
  test('Should delete a user with authentication', async () => {
    const response = await request(app)
    .delete('/users')
    .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
    .send()
    .expect(200);

    // Assert the deleted user is not in database anymore.
    const foundUser = await User.findById(response.body._id);
    expect(foundUser).toBeNull();
  });

  test('Should not delete a user without authentication', async () => {
    await request(app)
      .delete('/users')
      .send()
      .expect(401);
  })
});


describe('Test PATCH /users', () => {
  test('Should update user profile with valid data', async () => {
    const response = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        'email': 'patchnew@google.com',
        'password': '66612345678',
        'public': true
      }).expect(200);

    // Assert the user profile is updated in database
    const user = await User.findByCredentials(response.body.name, '66612345678');
    expect(user.email).toBe('patchnew@google.com');
    expect(user.public).toBe(true);
  });

  test('Should not update username', async () => {
    await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({'name': 'hello'})
      .expect(400);
  });

  test('Should not update user profile with invalid email', async () => {
    await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({'email': 'kerker.moon'})
      .expect(400);
  });

  test('Should not update user profile with invalid finnhub token', async () => {
    await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({'finnhubToken': ''})
      .expect(400);
  });

  test('Should not update user profile without authentication', async () => {
    await request(app)
      .patch('/users')
      .send({'password': '777'})
      .expect(401);
  });
});

describe('Test GET /users', () => {
  test('Should return user profile with authentication', async () => {
    await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  });

  test('Should not return user profile without authtication', async () => {
    await request(app)
      .get('/users')
      .send()
      .expect(401);
  });
});