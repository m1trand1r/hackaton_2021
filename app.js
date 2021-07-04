var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var usersRouter = require('./components/users/usersRouter');
var searchRouter = require('./components/search/searchRouter');
var newsRouter = require('./components/news/newsRouter');

const db = require('./databases/mongoDB');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'components'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({ secret: 'aventica', resave: false, saveUninitialized: false }));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: true
},
  (username, password, done)  => {
    console.log(username, password);
    db.getUserByEmail(username)
    .then(user => {
      console.log(user);
      if (!user) {
        return done(new Error('Пользователь не найден.', false)); 
      }
      if (!db.comparePassword(password, user.password)) {
        return done(new Error('Неверный пароль.', false)); 
      }
      return done(null, user);
    })
    .catch(reason => {
      return done(reason);
    });
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  db.getById(id, 'users')
  .then(user => {
    if (user.length == 0) {
      return cb(new Error('Пользователь  ' + id + ' не найден.')); 
    }
    cb(null, user);
  })
  .catch(reason => {
    return cb(reason);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  if (res.locals.isAuthenticated) {
      res.locals.userInfo = {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          surname: req.user.surname,
          patronymic: req.user.patronymic,
          role: req.user.role
      }
  }
  next();
})

app.use('/', newsRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('commonViews/error');
});

module.exports = app;
