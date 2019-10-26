var express = require('express');
var router = express.Router();
var dbConn = require('../config/dbConn');

/* GET home page. */
router.post('/', function(req, res, next) {
  res.render('index', { title: 'botUI_api.ai' });
});

router.post('/hello', (req, res) => {
   console.log(res.body);

  //const dateToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';

   res.send({
        displayText:"hello world from webhook"
      });
});

router.post('/users', (req, res) => {

      console.log(req.body);

       dbConn.query("SELECT COUNT(*) AS totalusers FROM users",  (error, data) => {
      if (error) throw error;

      
      if(res != null){
        const result = res.status(200).json({
                status: 200,
                data : data
              });
             
              return result.data;
        }
        return  res.status(404).json({
          status: 404, 
          data: "not found"
        });
  });
});

router.post('/total_loan_disbursed', (req, res) => {
  dbConn.query('SELECT SUM(amount) AS total_loan_disbursed FROM disbursements',  (error, results, fields) => {
      if (error) throw error;
      if(res != null){
        res.setHeader('Content-Type', 'application/json');
        return res.send({ 
          error: false, 
          fulfilment: results, 
          message: 'total loan disbursed' 
        });
      }else{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          "speech" : "Error. Can you try it again ? ",
          "displayText" : "Error. Can you try it again ? "
        }));
      }

  });
});




module.exports = router;
