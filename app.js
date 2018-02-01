// configuration ====================================================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').load();

// views/middleware =================================================
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'pug')

// routes ===========================================================
require('./routes/index.js')(app)
require('./routes/list.js')(app)

// launch app =======================================================
app.listen(process.env.webport, () => {
	console.log('listening to port', process.env.webport)
});