const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const Stock = require('../src/models/stock');
const Price = require('../src/models/price');
const {user1, setupDatabase, createPriceCollection} = require('./fixtures/db');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
//  await createPriceCollection();
  await setupDatabase();
});

// beforeEach(async () => {
// });

describe('Test GET /stocks', () => {
  test('Should get the information of with parameter ticker', async () => {
    await request(app)
      .get('/stocks?ticker=GOOGL')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  });

  test('Should not get ticker information without authentication', async () => {
    await request(app)
      .get('/stocks?ticker=GOOGL')
      .send()
      .expect(401);
  })

  test('Should get ticker information of tickers, profits and returns in watchlish', async () => {
    await request(app)
      .get('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  })
});