var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');

var app = express();

var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogsite_restapi';
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err) {
  console.log(err);
})


app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/blogs', blogsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // show erros in development
  const errorDev = req.app.get('env') === 'development' ? err : {};

  // show the erros
  res.status(err.status || 500).json({msg: err.message, stack: errorDev.stack});

});

module.exports = app;
