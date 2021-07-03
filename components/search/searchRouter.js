var express = require('express');
var router = express.Router();

const searchController = require('./searchController');

/* GET search page. */
router.get('/', searchController.getSearch);
/* POST search page. */
router.post('/', searchController.postSearch);

module.exports = router;
