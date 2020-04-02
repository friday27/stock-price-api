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
      .get('/stocks/ticker?q=GOOGL')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  });

  test('Should not get ticker information without authentication', async () => {
    await request(app)
      .get('/stocks/ticker?q=GOOGL')
      .send()
      .expect(401);
  })

  test('Should get ticker information of tickers, profits and returns in watchlish', async () => {
    const response = await request(app)
      .get('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
    expect(response.profit).not.toBeNull();
    expect(response.return).not.toBeNull();
  })
});

// Add stocks into watchlish without held price and amount
describe('Test POST /stocks', () => {
  test('Should add tickers into user\'s watchlist without held price and amount', async () => {
    await request(app)
      .post('/stocks?tickers=NFLX,GOOGL,AMZN,FB')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(201);

    // Assert price and amount is saved in database
    const tickers = ['NFLX','GOOGL','AMZN','FB'];
    let foundTicker = await Stock.findOne({userId: user1._id, ticker: tickers[0]});
    expect(foundTicker).not.toBeNull();
    foundTicker = await Stock.findOne({userId: user1._id, ticker: tickers[1]});
    expect(foundTicker).not.toBeNull();
    foundTicker = await Stock.findOne({userId: user1._id, ticker: tickers[2]});
    expect(foundTicker).not.toBeNull();
    foundTicker = await Stock.findOne({userId: user1._id, ticker: tickers[3]});
    expect(foundTicker).not.toBeNull();
  });
});