const mongoose = require('mongoose');

const {MONGODB_HOST, MONGODB_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));