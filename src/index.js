const app = require('./app');
const setupPriceCollection = require('./utils/setup-price-collection');

const port = process.env.PORT;

app.listen(port, () => {
  setupPriceCollection();
  console.log('Server is up! Listening on ' + port);
});