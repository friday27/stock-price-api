//mongoose uses mongodb module
const mongoose = require('mongoose');

//provide the db name as part of the connection URL
mongoose.connect('mongodb://127.0.0.1:27017/stock-price-api', {
    useNewUrlParser: true,
    useCreateIndex: true
});