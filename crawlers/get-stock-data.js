/*
  Get basic lists of stocks from Finnhub API

  (Run from project root)
  ./node_modules/.bin/env-cmd -f ./config/dev.env node crawlers/get-stock-data.js
*/
const request = require('request');
const fs = require('fs');

const url = 'https://finnhub.io/api/v1';
const token = process.env.FINNHUB_TOKEN;

const folder = './data';

// Get supported stock exchanges
request(`${url}/stock/exchange?token=${token}`, {json: true}, (err, res, body) => {
  const filename = folder + '/stock-exchanges.json';
  if (err) { 
    return console.log(err);
  }
  body = JSON.stringify(body);
  fs.writeFileSync(filename, body, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${filename} is saved!`);
    }
  });
});

// Get US tickers
// Consider to complete it manually, as the limit of request = 50 tickers
// Also there're some duplicated displaySymbols
request(`${url}/stock/symbol?exchange=US&token=${token}`, {json: true}, (err, res, body) => {
  const filename = folder + '/us-stock-symbols.json';
  if (err) { 
    return console.log(err);
  } 
  body = JSON.stringify(body);
  fs.writeFileSync(filename, body, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${filename} is saved!`);
    }
  });
});
