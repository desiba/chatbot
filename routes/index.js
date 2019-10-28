var express = require('express');
var router = express.Router();
var dbConn = require('../config/dbConn');
const {WebhookClient} = require('dialogflow-fulfillment');



function welcome (agent) {
  agent.add(`Welcome to Express.JS webhook!`);
}

function fallback (agent) {
  agent.add(`I didn't understand from webhook`);
  agent.add(`I'm sorry, can you try again from webhook?`);
}

function WebhookProcessing(req, res) {
  const agent = new WebhookClient({request: req, response: res});
  console.info(`agent set`);

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
// intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  agent.handleRequest(intentMap);
}


// Webhook
router.post('/hook', function (req, res) {
  console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
  WebhookProcessing(req, res);
  console.log(res.body);
});






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

	const response = {
		fulfillmentText: "Your webhook works fine !",
	}
	res.json(response);
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
