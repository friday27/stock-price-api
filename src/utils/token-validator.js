const request = require('request');

function isValidFinnhubToken(token) {
  request(`https://finnhub.io/api/v1/stock/exchange?token=${token}`, {json: true}, (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    body = JSON.stringify(body);
    if (body.includes('Invalid API key')) {
      return console.log(false);
    }
    return console.log(true);
  });
};

module.exports = isValidFinnhubToken;