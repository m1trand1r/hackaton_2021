var express = require('express');
var router = express.Router();

const usersController = require('./newsController');

/* GET users listing. */
router.get('/', usersController.getNews);

module.exports = router;
