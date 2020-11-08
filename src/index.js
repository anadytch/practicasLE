require('dotenv').config();
const app = require('./config/server');

//Server is listenning
app.listen(app.get('port'), () => {
    console.log("server on port", app.get('port'));
});