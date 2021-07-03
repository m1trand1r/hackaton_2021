var express = require('express');
var router = express.Router();

const passport = require('passport');

const indexController = require('./indexController');

logOut = (req, res, next) => { 
  if (res.locals.isAuthenticated) req.logOut();
  next();
}

/* GET home page. */
router.get('/', indexController.getIndex);

router.get('/login', indexController.getLogin);
router.post('/login', passport.authenticate('local', 
  { 
      session: true, 
      successRedirect: '/', 
      failureRedirect: '/login'
  })
);

router.get('/registration', indexController.getRegistration);

module.exports = router;
