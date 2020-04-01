const request = require('request');

function isValidFinnhubToken(token, callback) {
  if (token === '') {
    callback('API key should not be empty.');
  }

  request(`https://finnhub.io/api/v1/stock/exchange?token=${token}`, {json: true}, (err, res, body) => {
    if (err) { 
      callback(err);
    }
    body = JSON.stringify(body);
    if (body.includes('Invalid API key')) {
      callback('Invalid API Key.');
    }
  });
};

module.exports = isValidFinnhubToken;