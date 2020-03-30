/*
  Get basic lists of forex from Finnhub API

  (Run from project root)
  ./node_modules/.bin/env-cmd -f ./config/dev.env node crawlers/get-forex-data.js

  Will need JSON validation after requesting.
*/
const request = require('request');
const fs = require('fs');

const url = 'https://finnhub.io/api/v1';
const token = process.env.FINNHUB_TOKEN;

const folder = './data';

// Get supported stock exchanges
// Completed this part manually as there are only 9 supported forex exchange
const exchanges = ['oanda','fxcm','forex.com','ic markets','fxpro','octafx','fxpig','pepperstone','icmtrader'];

const filename = folder + '/forex-symbols.json';
let data = [];

async function requestForexData(exchange, data) {
  await request(`${url}/forex/symbol?exchange=${exchange}&token=${token}`, {json: true}, async (err, res, body) => {
    if (err) { 
      return console.log(err);
    } 
    await data.push(...body);

    const len = data.length;
    data = await JSON.stringify(data);
    await fs.writeFile(filename, data, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${filename} is saved! Added ${body.length} records. Total ${len} records.`);
      }
    });
  });
};

// Get forex symbols
async function getForexSymbols() {
  for (let i = 0; i < exchanges.length; i++) {
    let data = await fs.readFileSync(filename);
    data = await JSON.parse(data);

    await requestForexData(exchanges[i], data);
  }
};

getForexSymbols();