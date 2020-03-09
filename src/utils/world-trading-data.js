const request = require('request');

const getRealTimeData = async (user, symbols='', callback) => {
  // Set symbols to favorate tickers if not given
  if (symbols === '') {
    symbols = user.favoriteTickers;
    console.log(symbols)
    // TODO: default ticker?
    if (symbols === '') {
      symbols = 'GOOGL'; 
    }
  }
  const url = 'https://api.worldtradingdata.com/api/v1/stock?symbol=' + symbols + '&api_token=' + APIToken;
  request({url, json: true}, (error, {body}) => {
    console.log(body);
    if (error) {
      callback('Unable to connect to stock price service.');
    } else if (body.error) {
      callback('Unable to get info for tickers: '+symbols);
    } else {
      callback(undefined, body);
    }
  });
};

// getRealTimeData();

module.exports = {
  getRealTimeData
};