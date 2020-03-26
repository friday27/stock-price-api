const {fetchTickerInfo, fetchForexInfo} = require('../utils/finnhub');

const period = 'D';
const count = 100;

fetchForexInfo('bpkbemnrh5rcgrlr91pg', 'FOREX:401484411', period, count, (err, data) => {
  if (err) {
    return console.log(err);
  }
  if (data.s !== 'ok') {
    console.log(data.s);
  }

  table = {};
  data.t.forEach(t => {
    const idx = data.t.indexOf(t);
    const date = new Date(t*1000);
    table[`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`] = {
      'open': data.o[idx],
      'closed': data.c[idx],
      'high': data.h[idx],
      'low': data.l[idx]
    }
  });
  console.log(table);

});

