var express = require('express');
var router = express.Router();
var dbConn = require('../config/dbConn');








/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'botUI_api.ai' });
});

router.post('/hello', (req, res) => {
   console.log(res.body);

  //const dateToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';

 res.setHeader('Content-Type', 'application/json');
 //var speech = req.body.result && req.body.result.parameters;

return res.status(200).json({
    speech: "hello from webhook",
    displayText: "hello from webhook",
    source: "hello world from webhook"
 });
 //return res.send({
    //text:"hello world from webhook"
  //});
  
   //return res.status(200).json({
        //displayText:"hello world from webhook"
     // });
      
});


// Webhook route
router.post('/webhook', (req, res) => {
  const data = req.body;
  
  console.log(data);

	// Code the task you want to achieve with @data
	// Read the v2 api documentation of dialogflow : https://dialogflow.com/docs/fulfillment
	// Using the v2 will become mandatory, Google wrote a guide to migrate from v1 to v2 as v2 is officially released

	let response = {
		fulfillmentText: "Your webhook works fine !",
	}
	res.json(response);
});


router.post('/users', (req, res) => {

      let action = req.body.queryResult.action;

      console.log('request header ' + JSON.stringify(req.headers));
      console.log('request body ' + JSON.stringify(req.body));
      console.log('Action ' + JSON.stringify(action));


      switch(action) {
        case "input.totalusers":

            dbConn.query("SELECT COUNT(*) AS totalusers FROM users",  (error, data) => {
              if (error) throw error;
        
                  console.log(JSON.stringify(data));
             
                  let total_users_response = {
                    fulfillmentText: JSON.stringify(data),
                  }
                  res.json(total_users_response);
                          
              });
          
          break;
        case "input.totalloandisbursement":

          var dateProperties = new Date('2015-03-04T00:00:00.000Z')
          
          let total_loan_disburement_response = {
            fulfillmentText:  dateProperties.getUTCFullYear,
          }
          res.json(total_loan_disburement_response);
          break;

        case "Apple":
          text = "How you like them apples?";
          break;

        case "input.totalloandisbursed":

              dbConn.query('SELECT SUM(amount) AS total_loan_disbursed FROM disbursements',  (error, data) => {
                if (error) throw error;
          
                    console.log(JSON.stringify(data));
               
                    let total_loan_response = {
                      fulfillmentText: JSON.stringify(data),
                    }
                    res.json(total_loan_response);
                            
                });

              break;
            case "Apple":
              text = "How you like them apples?";
              break;
        default:
            
            let default_response = {
              fulfillmentText: "default webhook",
            }
            res.json(default_response);
      }

      
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
