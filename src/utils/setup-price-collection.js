/*
  Save stock and forex data into MongoDB

  (Run from project root locally)
  ./node_modules/.bin/env-cmd -f ./config/dev.env node utils/setup-price-collection.js
*/

// Create schema and model
const mongooese = require('mongoose');
const fs = require('fs');
const Price = require('../models/price');

async function setupPriceCollection() {
  await mongooese.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  
  const folder = './data';
  
  // Compile stock data into writable format
  let stockSymbolsUS = await fs.readFileSync(folder+'/us-stock-symbols.json');
  stockSymbolsUS = await JSON.parse(stockSymbolsUS);
  stockSymbolsUS.forEach((stockObj) => {
    stockObj.exchange = 'US exchanges';
    stockObj.type = 'stock';
    stockObj.country = 'US';
    stockObj.currency = 'USD';
  });
  
  // Compile forex data into writable format
  let forexSymbols = await fs.readFileSync(folder+'/forex-symbols.json');
  forexSymbols = await JSON.parse(forexSymbols);
  forexSymbols.forEach((forexObj) => {
    forexObj.exchange = forexObj.symbol.split(':')[0];
    forexObj.type = 'forex';
    forexObj.country = 'multi';
    forexObj.currency = 'multi';
  });
  
  // Clean and save data
  await Price.deleteMany();
  
  await Price.insertMany(stockSymbolsUS, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Price data (stock) is saved!');
    }
  });
  
  await Price.insertMany(forexSymbols, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Price data (forex) is saved!');
    }
  });
};

setupPriceCollection();

setTimeout(() => {
  mongooese.disconnect();
}, 3000);