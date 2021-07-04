var express = require('express');
var router = express.Router();

const documentController = require('./documentController');

/* GET users listing. */
router.get('/', documentController.getDocument);

module.exports = router;
