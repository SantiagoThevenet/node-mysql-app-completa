const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { engine } = require('express-handlebars')



const indexRouter = require('./routes/index');
const linksRouter = require('./routes/links');
const authenticationRouter = require('./routes/authentication');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine(".hbs", engine({
  defaultLayout: "main",
  layoutsDir: path.join(path.join(__dirname, 'views'), "layouts"),
  partialsDir: path.join(path.join(__dirname, 'views'), "partials"),
  extname: ".hbs",
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');


// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Globbal variables
app.use((req, res, next) => {
  next()
})

// Routes 
app.use('/', indexRouter);
app.use('/links', linksRouter);
app.use('/authentication', authenticationRouter);



// Public
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
