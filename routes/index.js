var express = require('express');
var router = express.Router();
var userservices = require('../services/users_services');
var loanservices = require('../services/loan_services');
var dbConn = require('../config/dbConn');
const thousands = require('thousands');
const moment = require('moment');

let now = moment();








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
 
});




router.post('/webhook', async (req, res) => {

      const action = req.body.queryResult.action;
      let parameters = req.body.queryResult.parameters;


      switch(action) {

        case "input.totalloansbyrange":

            let qryText = JSON.stringify(req.body.queryResult.queryText);

            let req_match_month = /\bMONTH|\bthis month|\bmonth/g.test(qryText);
            let req_match_week = /\bWEEK|\bthis week|\bweek/g.test(qryText);

          

            let range;
            if(req_match_month){
               const monthStart = now.startOf('month').format("YYYY-MM-DD"),
                monthEnd = now.endOf('month').format("YYYY-MM-DD");
               
              range = {
                 start : monthStart,
                 end : monthEnd
               }

               loanservices.total_loan_disbursed_range(range, req, res);

            }
             
            if(req_match_week){
              const weekStart =  now.startOf('week').format("YYYY-MM-DD"),
               weekEnd = now.endOf('week').format("YYYY-MM-DD");
              range = {
                start : weekStart,
                end : weekEnd
              }

              loanservices.total_loan_disbursed_range(range, req, res);
            }

           
        break;

        case "input.loans-disbursed-by-date":
            //let findate = parameters.findate;
            const today_date = JSON.stringify(now.format("YYYY-MM-DD"));
            loanservices.total_loans_date(today_date, req, res);

        break;


        case "input.totalusers":

           userservices.total_users(req, res);
          
        break;


        

        case "input.userbannedreason":

            let id = parameters.id;

            console.log(req.body.queryResult.parameters.number);

           // let email = parameters.email;

            userservices.user_banned_reasons(id, req, res);

        break;

        case "input.wholinkedcard":

            
            let account_digits = parameters.card-digits;
            let card_dates = parameters.card-date;

            let account_digits_list = account_digits.split(" ");
            let card_date_list = card_dates.split("/");

            console.log(account_digits_list[0] +' '+ card_date_list[0]);
            
            break;
            
            

            if(account_digits_list[0].toString().length != 6){
                var temp = account_digits_list[0];
                account_digits_list[0] = account_digits_list[1];
                account_digits_list[1] = temp;

            }
           
           await dbConn.query(`SELECT email
                               FROM user_cards 
                               WHERE last4 = ${account_digits_list[1]} AND 
                                      bin = ${account_digits_list[0]} AND 
                                      exp_month = ${card_month} AND 
                                      exp_year = ${card_year}`,  (error, data) => {
              
              if (error) throw error;
              if (!data.length){
                  let user_email = {
                    fulfillmentText: 'First 6 digist '+account_digits_list[0]+
                                     '\nLast 4 disgits '+account_digits_list[1] +
                                     '\ncard not found',
                  }
                  res.json(user_email);
              }else{
                let user_email = {
                  fulfillmentText: data[0].email +' '+ data[1].email,
                }
                res.json(user_email);
           
              }
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
            
        default:
            
            let default_response = {
              fulfillmentText: "default webhook",
            }
            res.json(default_response);
      }

      
});








module.exports = router;
