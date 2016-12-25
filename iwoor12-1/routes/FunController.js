var express = require('express');
var router = express.Router();

var funController = require('../controllers/FunController');

router.get('/fun.html',funController.index);
router.get('/fun_:pageNo',funController.index);

router.get('/fun/:id',funController.detail);

module.exports = router;