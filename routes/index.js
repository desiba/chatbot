var express = require('express');
var router = express.Router();
var userservices = require('../services/users_services');
var loanservices = require('../services/loan_services');
var miscservices = require('../services/misc_services');
const thousands = require('thousands');
const moment = require('moment');
const db = require('../models/index');
const sequelize = require('sequelize');

var os = require('os');


let now = moment();








/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'botUI_api.ai' });
});

router.get('/getlocation', function(req, res, next){
  loanservices.total_users_joined_today(req, res);
})

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

        case "input.analytic-summary":
            let tag = parameters.tag;

            if(['this year', 'this week', 'last 90 days', 'last 30 days'].includes(tag)){

              let tag_formated = tag.split(' ').join('-');

              console.log(tag_formated);
          
               miscservices.payment_payload(tag_formated, req, res);

            }else if(['today','livetime'].includes(tag)){
              
              console.log(tag);

               miscservices.payment_payload(tag, req, res);

            }else{
              let response = {
                fulfillmentText: 'can\'t recognise tag',
              }
              res.json(response);
            }


           
              
            

           

        break;

        case "input.user_auto_charge":
            let user_id = parameters.loan_id;
            miscservices.auto_charge_user(user_id, req, res);
        break;

        case "input.total-loans-date-based":

          let loandate = parameters.loan_date;

          if(loandate == 'today'){
            loandate = moment().format('YYYY-MM-DD');
           
          }else if(loandate == 'yesterday'){
            loandate = moment().subtract(1, 'days').format('YYYY-MM-DD');
          }
          
            loanservices.total_loans_by_date(loandate, req, res);

        break;

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

          let first6digits =  parameters.first6digits;
          let last4digits = parameters.last4digits;
          let carddate = parameters.carddate;
          let carddigits = first6digits +' '+ last4digits +' '+carddate; 

         


          console.log(carddigits);
          console.log(os.hostname);

          /*
         
            let  everything = `${carddigits} ${parameters.carddate}`.replace(/\./g,' ').trim().split(' '),
                
                account_details_array = everything.filter((x) => {
                if(x !== "")
                    return true;
                });
          
            let account_digit_string = `${account_details_array[0]} ${account_details_array[1]}`;
            let card_digit_string = account_details_array[2];

            

            let account_digits_list = account_digit_string.split(" ");
          
            //console.log(account_details_array);
            
            //swap values to [first6digits, last4digits] if [last4digits, first6digits] == true
            if(account_digits_list[0].toString().length != 6){
                var temp = account_digits_list[0];
                account_digits_list[0] = account_digits_list[1];
                account_digits_list[1] = temp;
            }

            let first6digits = account_digits_list[0];
            let last4digits = account_digits_list[1];
            
            //console.log('card year ' + cardyear);
            let sql ;

            if(card_digit_string !== undefined && card_digit_string !== null){
              
              let card_date_list = card_digit_string.split("/");
              let cardmonth = card_date_list[0];
              let cardyear = card_date_list[1];



              let card_year_formatted = /\b[0-9]{4}/g.test(cardyear) ? cardyear : '20'+cardyear;
              
              let last4digits_formatted = /\b[0-9]{4}/g.test(last4digits) ? last4digits : '0'+last4digits;


             console.log(last4digits_formatted +' '+ first6digits +' '+ cardmonth +' '+card_year_formatted);
            

              sql = `SELECT DISTINCT email
                     FROM user_cards 
                     WHERE last4 = '${last4digits_formatted}' AND 
                          bin = '${first6digits}' AND 
                          exp_month = '${cardmonth}' AND 
                          exp_year = '${card_year_formatted}'`;
              }else{
              sql = `SELECT DISTINCT email
                     FROM user_cards 
                     WHERE last4 = '${last4digits_formatted}' AND 
                     bin = '${first6digits}'`;
              }

              console.log(sql);

          await db.sequelize.query(sql,  { type: sequelize.QueryTypes.SELECT})
            .then(function(data){

                console.log(data);
                

              if (!data.length){
                  
                let user_email = {
                  fulfillmentText: 'First 6 digist '+account_digits_list[0]+
                                   '\nLast 4 disgits '+account_digits_list[1] +
                                   '\ncard not found',
                }
                res.json(user_email);
            }else{

              let emails = '';
                  
                  data.forEach((item)=> {
                     emails = emails.concat(' '+item.email);
                  });

              let user_email = {
                fulfillmentText: emails,
              }
              res.json(user_email);
         
            }
          
           })
          .catch(err => {
            throw err;
            console.log(err);

           });


         */
          break;

        case "input.totalloandisbursed":

          loanservices.total_loans_disbursed(req, res);

        break;
            
        default:
            
            let default_response = {
              fulfillmentText: "default webhook",
            }
            res.json(default_response);
      }

      
});








module.exports = router;
