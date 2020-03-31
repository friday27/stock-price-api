const request = require('request');

function isValidFinnhubToken(token) {
  const {error, result} = request(`https://finnhub.io/api/v1/stock/exchange?token=${token}`, {json: true}, (err, res, body) => {
    if (err) { 
      return err; 
    }
    body = JSON.stringify(body);
    if (body.includes('Invalid API key')) {
      return false;
    }
    return true;
  });
  if (!error && result) {
    return true;
  }
  return false;
};

module.exports = isValidFinnhubToken;