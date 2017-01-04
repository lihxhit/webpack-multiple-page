/**
 * Created by Administrator on 2017/01/01 0001.
 */
let express = require('express');
let router = express.Router();
let path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/about.html')
});

module.exports = router;
