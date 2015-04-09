var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/home_page', function(req, res) {
    console.log("Am I being heard?");
    res.render('home_page', { title: 'Chat Application Homepage!' });
});

router.get('/', function(req, res){
  res.render('index', { title: 'client', scripts: ['javascripts/myClient.js']});
});

module.exports = router;
