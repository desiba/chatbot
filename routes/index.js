var express = require('express');
var router = express.Router();
var userservices = require('../services/users-services');
var dbConn = require('../config/dbConn');
const thousands = require('thousands');








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




router.post('/webhook', async (req, res) => {

      const action = req.body.queryResult.action;
      let parameters = req.body.queryResult.parameters;

      console.log('request header ' + JSON.stringify(req.headers));
      console.log('request body ' + JSON.stringify(req.body));
      console.log('Action ' + JSON.stringify(action));


      switch(action) {


        case "input.totalusers":

           userservices.total_users(req, res);
          
        break;


        case "input.totalloandisbursement":
          
          const dateObj = {
            day_period : parameters.day_period,
            date : parameters.date,
            date2 : parameters.date2,
            week_period : parameters.week_period,
            start_date : parameters.start_date,
            end_date : parameters.end_date

          }

          console.log(dateObj);
            
            dbConn.query("SELECT COUNT(*) AS loan_type FROM loan_type",  (error, data) => {
              if (error) throw error;
                  let results = 'total loan: '+ data[0].loan_type;
                 
                  console.log(JSON.stringify(data));
             
                  let total_loan_disburement_response = {
                    fulfillmentText: results,
                  }
                  res.json(total_loan_disburement_response);
    
                  
                          
              });

       
          break;

        case "input.userbannedreason":

            let userid = parameters.number;

            console.log(req.body.queryResult.parameters.number);

            let email = parameters.email;

            userservice.user_banned_reasons(userid, email, req, res);

        break;

        case "input.linkcard":
          
            let account_digits_list = parameters.number;

            if(account_digits_list[0].toString().length != 6){
                var temp = account_digits_list[0];
                account_digits_list[0] = account_digits_list[1];
                account_digits_list[1] = temp;

            }

            console.log(account_digits_list);

            //[first6, last4]
            //let results = JSON.stringify(account_digits_list);
            //let results = account_digits_list;
            //let first6digits = results[0];
            //let last4digits = results[1];

            //let firstdigits = (/^(\d{6})$/.results[0]) ? 'passed' : 'failed';
            //let lastdigits = (/^(\d{4})$/.results[1]) ? 'passed' : 'failed';

            //console.log(results[0]);
            //console.log(results[1]);
            //console.log(results);
            //console.log(firstdigits +' '+ lastdigits);

           


           await dbConn.query(`select email from user_cards where last4 = ${account_digits_list[1]} and bin = ${account_digits_list[0]}`,  (error, data) => {
              console.log("data = " +data);

              if (!data.length)
                  throw error.message;
            /*
              if (error) {
                console.log(error);
                let user_email = {
                  fulfillmentText: 'First 6 digist'+account_digits_list[0]+' and Last 4 disgits '+account_digits_list[1] +' card not found',
                }
                res.json(user_email);
                
              }
*/
              //if(data !== undefined || data.length > 0){
                //if (error) throw error;
                  
                  let user_email = {
                    fulfillmentText: data[0].email +' '+ data[1].email,
                  }
                  res.json(user_email);
             
              

            });
          break;

        case "input.totalloandisbursed":

              dbConn.query('SELECT SUM(amount) AS total_loan_disbursed FROM loan_requests WHERE approval_status IN (1,3,7,9)',  (error, data) => {
                if (error) throw error;

                    let result_total_disbursment = data[0].total_loan_disbursed
                    
                    let total_loan_response = {
                      fulfillmentText: thousands(result_total_disbursment),
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
