/*
  Save stock/forex collections into MongoDB

  (Run from project root)
  ./node_modules/.bin/env-cmd -f ./config/dev.env node crawlers/get-us-symbols.js
*/

// Create schema and model
const mongooese = require('mongoose');
const fs = require('fs');

mongooese.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const folder = './data';

// Compile stock data into writable format
let stockSymbolsUS = fs.readFileSync(folder+'/us-stock-symbols.json');
stockSymbolsUS = JSON.parse(stockSymbolsUS);
stockSymbolsUS.forEach((stockObj) => {
  stockObj.exchange = 'US exchanges';
  stockObj.type = 'stock';
  stockObj.country = 'US';
  stockObj.currency = 'USD';
});

// Compile forex data into writable format
let forexSymbols = fs.readFileSync(folder+'/forex-symbols.json');
forexSymbols = JSON.parse(forexSymbols);
forexSymbols.forEach((forexObj) => {
  forexObj.exchange = forexObj.symbol.split(':')[0];
  forexObj.type = 'forex';
  forexObj.country = 'multi';
  forexObj.currency = 'multi';
});

// Save data
Price.insertMany(stockSymbolsUS, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Price data (stock) is saved!');
  }
});

Price.insertMany(forexSymbols, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Price data (forex) is saved!');
  }
});