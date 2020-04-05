const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const Forex = require('../src/models/forex');
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

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Test GET /fx', () => {
  test('Should return fx chart', async () => {
    await request(app)
      .get('/fx/chart')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  });

  test('Should return fx info of a specific symbol', async () => {
    const response = await request(app)
      .get('/fx/chart?symbol=GBP/PLN')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
    // expect(response.length).toBe(4);
  });

  test('Should return fx chart with conditions', async () => {
    await request(app)
      .get('/fx/chart?exchage=OANDA&sortBy=popularity:desc&limit=5')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  });

  test('Should not return fx chart with invalid conditions', async () => {
    await request(app)
      .get('/fx/chart?sortBy=name:desc')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(400);
  });

  test('Should not return fx chart without authentication', async () => {
    await request(app)
      .get('/fx/chart')
      .send()
      .expect(401);
  });

  test('Should return supported forex symbols of the exchange', async () => {
    await request(app)
      .get('/fx/chart?exchange=oanda')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  });

  test('Should not get fx information without authentication', async () => {
    await request(app)
      .get('/fx/chart')
      .send()
      .expect(401);
  })

  test('Should get the fx symbols listed in user\'s watchlish', async () => {
    const response = await request(app)
      .get('/fx')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);
  })
});

// Add fx symbol into watchlish
describe('Test POST /fx', () => {
  test('Should add fx into user\'s watchlist', async () => {
    const symbol = 'FXCM:FRA40';
    // Save the original popularity
    const price = await Price.findOne({symbol});
    const pop = price.popularity;

    await request(app)
      .post('/fx/'+symbol)
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(201);

    // Assert the ticker is saved in database
    const foundFx = await Forex.findOne({userId: user1._id, symbol});
    expect(foundFx).not.toBeNull();
    // Assert the popularity of ticker += 1
    const afterPrice = await Price.findOne({symbol});
    const afterPop = afterPrice.popularity;
    expect(afterPop-pop).toBe(1);
  });

  test('Should not add non-exising fx symbol into user\'s watchlist', async () => {
    await request(app)
      .post('/fx/invalid')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(404);
  });

  test('Should not add tickers into user\'s watchlist without authentication', async () => {
    await request(app)
      .post('/fx/OANDA:IN50_USD')
      .send()
      .expect(401);
  });
});

describe('Test DELETE /fx', () => {
  test('Should delete fx symbol from user\'s watchlist', async () => {
    const symbol = 'OANDA:EU50_EUR';
    await request(app)
      .post('/fx/'+symbol)
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(201);

    await request(app)
      .delete('/fx/'+symbol)
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(200);

    // Asset the ticker is not in database
    const foundFx = await Forex.findOne({
      userId: user1._id,
      symbol
    });
    expect(foundFx).toBeNull();
  });

  test('Should not delete tickers which are not in user\'s watchlist', async () => {
    await request(app)
      .delete('/fx/invalid')
      .set('Authorization', `Bearer ${user1.jsonWebTokens[0].jsonWebToken}`)
      .send()
      .expect(404);
  });

  test('Should not delete tickers from user\'s watchlist without authentication', async () => {
    await request(app)
      .delete('/fx/OANDA:EU50_EUR')
      .send()
      .expect(401);
  });
});