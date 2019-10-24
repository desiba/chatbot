var express = require('express');
var router = express.Router();
var dbConn = require('../config/dbConn');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'botUI_api.ai' });
});

router.get('/hello', (req, res) => {


  //const dateToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';

   res.send("hello world");
});

router.get('/users', (req, res) => {
  dbConn.query('SELECT COUNT(*) FROM users',  (error, results, fields) => {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'users list.' });
  });
});




module.exports = router;
