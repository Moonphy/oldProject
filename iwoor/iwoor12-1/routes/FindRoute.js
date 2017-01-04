var express = require('express');
var router = express.Router();
var findController  = require('../controllers/FindController');


router.get('/find.html',findController.FolderType);

router.get('/find_folder.html',findController.find_folder);

router.get('/find_user.html',findController.folder_user);


module.exports = router;