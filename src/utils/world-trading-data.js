const request = require('request');

const getRealTimeData = async (APIToken, ticker, callback) => {
  const url = 'https://api.worldtradingdata.com/api/v1/stock?symbol=' + ticker + '&api_token=' + APIToken;
  request({url, json: true}, (error, {body}) => {
    if (error) {
      callback('Unable to connect to stock price service.');
    } else if (body.error) {
      callback('Unable to get info for tickers: '+symbol);
    } else {
      callback(undefined, body);
    }
  });
};

getRealTimeData('xknhPpBzePjOX3ftn6xYiuCokURbT0LsTqu26BSFD9IOCU2kNfsIgqakHpRD', 'SNAP,AA', (err, res) => {
  console.log(err, res);
});

module.exports = {
  getRealTimeData
};