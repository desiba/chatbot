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

        case "input.total-users-today":
            userservices.total_users_today(req, res);

        break;

        case "input.total-loans-week":

            loanservices.total_loans_week(req, res);

        break;

        case "input.total-loans-month":

            loanservices.total_loan_month(req, res);
            
        break;

        case "input.total-loans-today":
            
            loanservices.total_loans_today(req, res);

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

            
            let account_digits = parameters.carddigits;
            let card_dates = parameters.carddate;
            let everything = `${account_digits} ${card_dates}`;

            var newStr = everything.replace(/\./g,' ').trim();
            var arrNew = newStr.split(' ');
            var account_details_array = arrNew.filter((x) => {
              if(x!=="")
                  return true;
              
            });
          
            let account_digit_string = `${account_details_array[0]} ${account_details_array[1]}`;
            let card_digit_string = account_details_array[2];


            
            let account_digits_list = account_digit_string.split(" ");
            let card_date_list = card_digit_string.split("/");

            console.log(card_date_list);
            console.log(account_digits_list);
            break

            if(account_digits_list[0].toString().length != 6){
                var temp = account_digits_list[0];
                account_digits_list[0] = account_digits_list[1];
                account_digits_list[1] = temp;
            }

            let first6digits = account_digits_list[0];
            let last4digits = account_digits_list[1];
            let cardmonth = card_date_list[0];
            let cardyear = card_date_list[1];

            console.log('card year ' + cardyear);

          if(/\b[0-9]{4}/g.test(cardyear)){
           await dbConn.query(`SELECT email
                               FROM user_cards 
                               WHERE last4 = ${last4digits} AND 
                                      bin = ${first6digits} AND 
                                      exp_month = ${cardmonth} AND 
                                      exp_year = ${cardyear}`,  (error, data) => {
              console.log(data);
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
                  fulfillmentText: data[0].email,
                }
                res.json(user_email);
           
              }
            });
          }else{
            let user_email = {
              fulfillmentText: 'account details are not properly formatted ###### #### ##/####',
            }
            res.json(user_email);
          }
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
