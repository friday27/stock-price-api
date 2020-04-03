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
  await setupDatabase();
  // await createPriceCollection();
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
  test('Should add ticker into user\'s watchlist without held price and amount', async () => {
    // Save the original popularity
    const price = await Price.findOne({displaySymbol: 'FB'});
    const pop = price.popularity;

    await request(app)
      .post('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        ticker: 'FB'
      })
      .expect(201);

    // Assert the ticker is saved in database
    const foundTicker = await Stock.findOne({userId: user1._id, ticker: 'FB', cost: 0, amount: 0});
    expect(foundTicker).not.toBeNull();
    // Assert the popularity of ticker += 1
    const afterPrice = await Price.findOne({displaySymbol: 'FB'});
    const afterPop = afterPrice.popularity;
    expect(afterPop-pop).toBe(1);
  });

  test('Should add tickers into user\'s watchlist with held price and amount (add buying record)', async () => {
    // Save the original popularity
    const price = await Price.findOne({displaySymbol: 'FB'});
    const pop = price.popularity;

    const response = await request(app)
      .post('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        ticker: 'FB',
        cost: 25,
        amount: 10
      })
      .expect(201);
    
    // Assert the ticker is saved in database
    const foundTicker = await Stock.findById(response.body._id);
    expect(foundTicker).not.toBeNull();
    // Assert the popularity of ticker += 1
    const afterPrice = await Price.findOne({displaySymbol: 'FB'});
    const afterPop = afterPrice.popularity;
    expect(afterPop-pop).toBe(1);
  });

  test('Should not add tickers into user\'s watchlist with negative held price', async () => {
    await request(app)
      .post('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        ticker: 'AMGN',
        cost: -100,
        amount: 666
      })
      .expect(400);
  })

  test('Should not add non-exising tickers into user\'s watchlist', async () => {
    await request(app)
      .post('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        ticker: 'XXXX'
      })
      .expect(404);
  });

  test('Should not add tickers into user\'s watchlist without authentication', async () => {
    await request(app)
      .post('/stocks')
      .send({
        ticker: 'AMGN'
      })
      .expect(401);
  });

  // Sell -> amount < 0
  test('Should add selling records into user profile', async () => {
    const beforeStock = await Price.findOne({displaySymbol: 'NFLX'});
    const beforePop = await beforeStock.popularity;
    await request(app)
      .post('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        ticker: 'NFLX',
        cost: 400,
        amount: -10
      })
      .expect(201);
    
    // Assert the total amount in database is reduced
    let heldAmount = await Stock.aggregate([
      {$match: {
          userId: user1._id.toString(),
          ticker: 'NFLX'
      }}, 
      {$group: {
        _id: '$ticker',
        totalAmount: {$sum: '$amount'}
      }}
    ]);
    heldAmount = heldAmount[0].totalAmount;
    expect(heldAmount).toBe(10);

    // Assert the popularity is decreased
    const afterStock = await Price.findOne({displaySymbol: 'NFLX'});
    const afterPop = await afterStock.popularity;
    expect(afterPop-beforePop).toBe(-1);
  });

  test('Should not add selling records when the stock amount held by the user is less than selling amount', async () => {
    await request(app)
      .post('/stocks')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send({
        ticker: 'NFLX',
        cost: 400,
        amount: -30
      })
      .expect(400);
  })
});