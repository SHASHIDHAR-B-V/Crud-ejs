const express = require('express');
const taskRouter = require('./routes/taskRouter');

const db = require('./config/db');
db();
let methodOverride = require('method-override');
let app = express();

//for ejs
app.set('view engine', 'ejs');

//middlewares
app.use(methodOverride('_method'));
app.use(express.json());
//for using static web page
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

//base route
app.use('/api/v1/taskManager', taskRouter);

module.exports = app;
