const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const stockRouter = require('./routers/stock');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(stockRouter);

app.listen(port, () => {
  console.log('Server is up!');
});