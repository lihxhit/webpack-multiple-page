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
router.get('/about', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/about.html')
});
router.get('/media', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/media.html')
});
router.get('/contact', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/contact.html')
});
router.get('/invite', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/career.html')
});
router.get('/privacy', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/policy.html')
});
// privacy
module.exports = router;
