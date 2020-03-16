var express = require('express');
var router = express.Router();
var userservices = require('../services/users_services');
var loanservices = require('../services/loan_services');
var miscservices = require('../services/misc_services');
const thousands = require('thousands');
const moment = require('moment');
const db = require('../models/index');
const sequelize = require('sequelize');



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

          let card_details_from_dialogflow = parameters.card_details;

          //console.log(card_details_from_dialogflow);


          //let first_six_digits =  parameters.first6digits;
          //let last_four_digits = parameters.last4digits;
          //let card_month = parameters.cardmonth;
          //et card_year = parameters.cardyear;
          //let sql = '';

          let card_details = card_details_from_dialogflow.replace(/[\/|-|#]/g,' ').trim().split(' '); 
          
          console.log(card_details);

          //let six_digits = card_details[0];
          //let four_digits = card_details[1];
          //let month = card_details[2];
          //let year = card_details[3];

          /*

          if(six_digits.toString().length < 6){

            let card_digits_resp = {
              fulfillmentText: 'please follow this format; first-six-digits last-four-digits card-month card-year',
            }
            res.json(card_digits_resp);
          }

          if(four_digits.toString().length < 4){
            let diff = four_digits.toString().length - 4;
            if(diff == 1) four_digits = '0' + four_digits;
            if(diff == 2) four_digits = '00' + four_digits;
            if(diff == 3) four_digits = '000' + four_digits;
          }

          if(month != undefined && year != undefined){

            if(month.toString().length < 2){
              month = '0' + month;
            }

            if(year.toString().length == 2){
              year = '20' +  year;
            }

            sql = `SELECT DISTINCT email
                     FROM user_cards 
                     WHERE last4 = '${four_digits}' AND 
                          bin = '${six_digits}' AND 
                          exp_month = '${month}' AND 
                          exp_year = '${year}'`;

          }else{
            sql = `SELECT DISTINCT email
                     FROM user_cards 
                     WHERE last4 = '${four_digits}' AND 
                     bin = '${six_digits}'`;
          }


          await db.sequelize.query(sql,  { type: sequelize.QueryTypes.SELECT})
          .then(function(data){

            if (!data.length){
                
              let user_email = {
                fulfillmentText: 'First six digits '+six_digits+
                                 '\nLast four disgits '+four_digits+
                                 '\nCard Month  '+month+
                                 '\nCard Year '+year+
                                 '\n:point_right: card not found',
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
