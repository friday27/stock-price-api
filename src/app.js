const express = require('express');
const userRouter = require('./routers/user');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(userRouter);
// app.use(stockRouter);
// app.use(fxRouter);

module.exports = app;