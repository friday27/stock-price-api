const request = require('request'); 
const date = require('date-and-time');

// TODO: switch to built-in Date operations
const getHistoricalPrices = async function(startYear=null, startMonth=null, startDay=null, endYear=null, endMonth=null, endDay=null, days=7, ticker, callback) {
  // If the endDate is not given, set endDate to today.
  const today = await new Date();
  if (!endYear || !endMonth || !endDay) {
    endYear = date.format(today, 'YYYY');
    endMonth = date.format(today, 'MM');
    endDay = date.format(today, 'DD');
  }
  const endDate = await Math.floor(Date.UTC(endYear, endMonth, endDay, 0, 0, 0)/1000);

  // If the endDate is not given, set startDate to endDate - {{days}}.
  if (!startYear || !startMonth || !startDay) {
    const past = await date.addDays(new Date(Date.UTC(endYear, endMonth-1, endDay, 0, 0, 0)), days*-1);
    startYear = date.format(past, 'YYYY');
    startMonth = date.format(past, 'MM');
    startDay = date.format(past, 'DD');
  } 
  startDate = await Math.floor(Date.UTC(startYear, startMonth, startDay, 0, 0, 0)/1000);
  console.log(endYear, endMonth, endDay, endDate);
  console.log(startYear, startMonth, startDay, startDate);

  // request('https://finance.yahoo.com/quote/' + ticker + '/history?period1=' + startDate + '&period2=' + endDate + '&filter=history', function(err, res, body){
	// 	if (err) {
	// 		callback(err);
	// 	}
  //   // const prices = JSON.parse(body.split('HistoricalPriceStore\":{\"prices\":')[1].split(",\"isPending")[0]);
  //   const prices = JSON.parse(body);
	// 	callback(null, prices);
	// });
};

getHistoricalPrices(null, null, null, null, null, null, 7, 'JNJ', function (err, prices) {
  console.log(prices);
});

// module.exports.getHistoricalPrices = function(startMonth, startDay, startYear, endMonth, endDay, endYear, ticker, frequency, callback){

// 	var startDate = Math.floor(Date.UTC(startYear, startMonth, startDay, 0, 0, 0)/1000);

// 	var endDate = Math.floor(Date.UTC(endYear, endMonth, endDay, 0, 0, 0)/1000);

// 	request("https://finance.yahoo.com/quote/" + ticker + "/history?period1=" + startDate + "&period2=" + endDate + "&interval=" + frequency + "&filter=history&frequency=" + frequency, function(err, res, body){

// 		if (err) {

// 			callback(err);

// 		}

// 		var prices = JSON.parse(body.split('HistoricalPriceStore\":{\"prices\":')[1].split(",\"isPending")[0]);

// 		callback(null, prices)

// 	});

// };

// module.exports.getCurrentPrice = function(ticker, callback){

// 	request("https://finance.yahoo.com/quote/" + ticker + "/", function(err, res, body){

// 		if (err) {

// 			callback(err);

// 		}

// 		var price = parseFloat(body.split("currentPrice")[1].split("fmt\":\"")[1].split("\"")[0]);

// 		callback(null, price);

// 	});

// };