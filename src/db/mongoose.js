//mongoose uses mongodb module
const mongoose = require('mongoose');

//provide the db name as part of the connection URL
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});