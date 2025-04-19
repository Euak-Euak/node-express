var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nunjucks = require('nunjucks');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.get('/message', (req, res) => {
    console.log('login Try');
    console.log('login Success');
    let result = {
        message: ''
    };
  
    result.message = 'Hello wolrd!';
    res.render(result);
});
app.listen(3030, () => {
    console.log('server is running at 3030 port.');

      console.log('login Try');
    console.log('login Success');
})
