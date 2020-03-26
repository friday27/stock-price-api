const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const stockRouter = require('./routers/stock');
const fxRouter = require('./routers/fx');
// const followingRouter = require('./routers/following');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(stockRouter);
app.use(fxRouter);
// app.use(followingRouter);

module.exports = app;